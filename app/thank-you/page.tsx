'use client';
/*eslint-disable*/
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
//import Container from 'react-bootstrap/Container';
//import Row from 'react-bootstrap/Row';
//import Col from 'react-bootstrap/Col';
//import { Button, Container, Row, Col } from 'react-bootstrap';


export default function ThankYou() {

    const remarkPlugins = [remarkGfm, remarkBreaks];

    const [formattedMessage, setFormattedMessage] = useState('Please wait for the list');

    useEffect(() => {
        fetchQuotes();
    }, []);

    //let zipCode = ''; // It will come from path 
    //let age = ''; // It will come from path
    let gender = 'F';
    let tobacco = 0;
    let plan = 'G';
    let withLimit = process.env.NEXT_PUBLIC_QUOTE_LIMIT;

    const searchParams = useSearchParams();

    const age = searchParams.get('age');
    const zipCode = searchParams.get('zipCode');

    // En düşük 15 pricing 

    const fetchQuotes = async () => {
        // Call API with input values

        const response = await fetch('/api/quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                zip5: zipCode,
                age,
                gender,
                tobacco,
                plan,
                withLimit,
            }),
        });


        const result = await response.json();
        let messageList: string[] = [];

        var res = JSON.parse(result);

        if (res.length > 0) {
            res.map((quote: any) => {
                const discounts = quote?.discounts || [];
                const sortedDiscounts = discounts.sort(
                    (a: { value: number }, b: { value: number }) => b.value - a.value
                );
                const discountMessage = sortedDiscounts.map(
                    (discount: { name: any; value: number }) =>
                        `${discount.name} discount ${(discount.value * 100).toFixed(2)}%`
                );

                const rateIncreases = quote?.rate_increases || [];
                const sortedRateIncreases = rateIncreases.sort(
                    (a: { date: string }, b: { date: string }) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                const recentRateIncreases = sortedRateIncreases.slice(0, 3);
                const rateIncreaseMessage = recentRateIncreases.map(
                    (rateIncrease: { date: string; rate_increase: number }) =>
                        `${new Date(rateIncrease.date).getFullYear()} ${(
                            rateIncrease.rate_increase * 100
                        ).toFixed(2)}%`
                );

                const naic = quote?.company_base?.naic;

                //TODO :
                const rate = quote?.rate?.month;
                const formattedRate = rate ? `$${(rate / 100).toFixed(2)}` : '';
                const message = `Company: [Contact us for name], ${formattedRate}/month, rate type: ${quote?.rate_type}${discountMessage.length > 0 ? `, ${discountMessage.join(', ')}` : ''
                    }${rateIncreaseMessage.length > 0
                        ? `, rate increase: ${rateIncreaseMessage.join(', ')}`
                        : ''
                    }`;

                messageList.push(message);
            });
        } else {
            messageList.push('No quote found for your NAICs');
        }

        const numeratedMessage = messageList
            .map((message: string, index: number) => `  ${index + 1}- ${message}\n`)
            .join('');

        setFormattedMessage(`${numeratedMessage}`);

        if (!response.ok) {
            console.error('Error:', response);
            return;
        }
    }

    return (

<div className="container">
    <div className="header fixed-top-menu">
      <div>
        <img src="/logo.png"></img>

    </div>
      <p>A licensed insurance agent will answer your call 24/7</p>
      <div className="call-button">
        <p>Click-to-Call:<br/> <a className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="+1-844-618-0676" >1-844-618-0676</a></p>
      </div>
    </div>

    <div className="note">
      <p>To get a detailed quote that includes the carrier name and factors in your specific gender & tobacco-use details, please click-to-call <a className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" href="+1-844-618-0676" >1-844-618-0676</a> to speak with a licensed agent 24/7.</p>
      <p>This can be done over the phone or via email, with no obligation to enroll.</p>
      <p>While these rates are accurate, regulations prevent us from displaying the names of the carriers online.</p>
    </div>

    <div className="plan-list">
      <h2>Here are the lowest-priced top 15 rates for <b>Plan G</b> that you requested. Note that prices may vary based on gender and tobacco usage:</h2>
      <ul>
        <li><b>{age}-year-old</b></li>
        <li><b>Non-tobacco</b></li>
        <li><b>Female</b></li>
        <li><b>{zipCode}</b></li>
      </ul>

      <ol className="mt-4">
      <ReactMarkdown remarkPlugins={remarkPlugins} className="font-medium">
      {formattedMessage}
      </ReactMarkdown>
      </ol>
    </div>

    <div className="footer">
      <p>Owner: Pollen Insurance Group LLC. Copyright © 2024. All rights reserved. Not connected with or endorsed by the U.S. government or the federal Medicare program.</p>
      <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Contact Us</a></p>
    </div>
  </div>
    );
};