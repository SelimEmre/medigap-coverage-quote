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
    //let plan = 'G';
    let withLimit = process.env.NEXT_PUBLIC_QUOTE_LIMIT;

    const searchParams = useSearchParams();

    const age = searchParams.get('age');
    const zipCode = searchParams.get('zipCode');
    const plan = searchParams.get('plan');

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
                plan: plan ? plan : "G", // It's default G
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
        const maxLines = Number(process.env.NEXT_PUBLIC_QUOTE_LIMIT) || 15;

        const numeratedMessage = messageList
            .slice(0, maxLines)
            .map((message: string, index: number) => ` ${index + 1}- ${message}\n`)
            .join('') +
            (messageList.length > maxLines ? '' : '');

        setFormattedMessage(`${numeratedMessage}`);

        if (!response.ok) {
            console.error('Error:', response);
            return;
        }
    }

    return (

        <><><div className="header fixed-top-menu">
            <div className="container-sm">

                <div className='float-left'>
                    <img src="/logo.svg"></img>

                </div>


                <div className="click-call bold-text float-right">
                    <p>Click-to-Call:<br /> <a className="link-text" href="tel:+18446180676">1-844-618-0676</a> <br />TTY: 711</p>
                </div>

                <div className="bold-text float-right middle-text">
                    <p>A licensed insurance agent will answer your call 24/7</p>
                </div>

            </div>
        </div>


            <div className="container-sm">
                <div className="body-text">
                    <div className="top-container">
                        <ul>
                            <li><p className="bold-text">To get a detailed quote that includes the carrier name and factors in your specific gender & tobacco-use details,
                                please click-to-call <a className="link-text" href="tel:+18446180676">1-844-618-0676</a> to speak with a licensed agent 24/7.</p>
                            </li>
                            <li>
                                While these rates are accurate, regulations prevent us from displaying the names of the carriers online.</li>
                        </ul>


                    </div>

                    <div className="plan-list">
                        <p>Here are the lowest-priced top 15 rates for <b>plan {plan ? plan : "G"}</b> that you requested. Note that prices may vary based on gender and tobacco usage:</p>
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

                </div>
            </div></>

            <div className="footer">
                <div className="container-sm">
                    <div className="footer-text">
                        <p> © Pollen Insurance Group LLC. Copyright 2024. All rights reserved.<br />
                            Owned by: Pollen Insurance Group LLC. Not connected with or endorsed by the U.S. government or the federal
                            Medicare program. Invitations to apply for insurance on MedigapCoverage.com are issued by Pollen Insurance
                            Group LLC and are available only in regions where it is licensed and appointed. Licensing details for Pollen Insurance
                            Group are available <a target="_blank" href="https://quote.medigapcoverage.com/quote/licensing">here</a>. If you would like to find more information about the Government Medicare program please
                            visit the Official US Government Site for People with Medicare located at <a href="https://www.medicare.gov/" target='_blank'>www.medicare.gov</a>, 1-800-MEDICARE, or
                            your local State Health Insurance Program (SHIP) to get information on all of your options.
                            <br /><br />
                            This purpose of this communication is intended to solicit insurance. A licensed insurance agent/producer or insurance
                            company will contact you. Enrollment in a plan may be restricted to specific times of the year unless you qualify for a
                            special enrollment period or are within your Medicare Initial Election Period.
                        </p>

                        <p><a className="text-padding" target="_blank"  href="https://quote.medigapcoverage.com/privacy-policy">Privacy Policy</a>  |  
                         <a className="text-padding" target="_blank"  href="https://quote.medigapcoverage.com/terms-and-conditions">Terms of Service</a>  |  
                         <a className="text-padding" target="_blank"  href="https://quote.medigapcoverage.com/quote/contact-us">Contact Us</a></p>
                    </div>
                </div>
            </div>

            <div className="footer section-block">
                <span  className="bold-text element-text"><a href="tel:+18446180676" target="_blank" className="url-link">Click-to-Contact 1-844-618-0676</a></span>
            </div>

        </>


    );
};