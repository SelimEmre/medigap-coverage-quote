import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from 'next/server';


export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
      //Take values from supabase
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || '');
    
      let { data: settings, error } = await supabase.from('settings').select('*');

      const tokenRaw = settings?.find(
        (item: any) => item.key === 'medigapi_token',
      );

      const myHeaders = new Headers();
      myHeaders.append('x-api-token', tokenRaw?.value_string!);
      const { zip5, age, gender, tobacco, plan, withLimit } = await req.json();

      const requestOptions: RequestInit = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };
  
      const limitQuery = withLimit
      ? `&offset=0&limit=${process.env.NEXT_PUBLIC_QUOTE_LIMIT || 15}`
      : '';
  
        const url =
        `${process.env
          .NEXT_PUBLIC_MEDIGAP_API_URL!}?zip5=${zip5}&age=${age}&gender=${gender}&tobacco=${tobacco}&plan=${plan}&select=0` +
        limitQuery;

      let response = await fetch(url, requestOptions);
      if (response.status === 403) {

        const postRequestOptions: RequestInit = {
          method: 'POST',
          body: JSON.stringify({
            api_key: process.env.NEXT_PUBLIC_MEDIGAPI_KEY,
            portal_name: 'csg_individual'
          }),
          redirect: 'follow'
        };

        response = await fetch(
          process.env.NEXT_PUBLIC_MEDIGAP_AUTH_API_URL!,
          postRequestOptions
        );
        const authData = await response.json();
        const newToken = authData.token;
  
        await supabase
          .from('settings')
          .update({ value_string: newToken })
          .eq('id', tokenRaw?.id!);
  
        //new Request for quote with a new token
        const newHeader = new Headers();
        newHeader.append('x-api-token', newToken);
  
        const newRequestOptions: RequestInit = {
          method: 'GET',
          headers: newHeader,
          redirect: 'follow'
        };
  
        response = await fetch(url, newRequestOptions);
      }

      const result = await response.text();
      return NextResponse.json(result);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }