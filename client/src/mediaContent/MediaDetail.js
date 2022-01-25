import React, { useState, useContext, useEffect } from "react";
import './MediaDetail.css';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import getMediaMetadata from '../common/getMediaMetadata';


const MediaDetail = ({ media_id, media_type }) => {

    const [mediaMetadata, setMediaMetadata] = useState({});
    const media_title = mediaMetadata?.title !== undefined ? mediaMetadata?.title : mediaMetadata?.name;
    const audience = `${process.env.REACT_APP_SERVER}`;
    const genres = mediaMetadata?.genres !== undefined ? mediaMetadata?.genres.map(genre => {
        return <span>{` ${genre.name},`}</span>
    }) : "";
    const originalLanguage = mediaMetadata?.original_language !== undefined ? mediaMetadata?.original_language : "";
    const productionCountries = mediaMetadata?.production_countries !== undefined ? mediaMetadata?.production_countries.map(country => { return <span>{` ${country.name},`}</span> }) : "";
    const productionCompanies = mediaMetadata?.production_companies !== undefined ? mediaMetadata?.production_companies.map(company => { return <span>{` ${company.name},`}</span> }) : "";

    const setMediaMetadataAsync = async () => {
        const response = await getMediaMetadata(media_type, media_id);
        setMediaMetadata(response);
    };
    useEffect(() => {
        setMediaMetadataAsync();
    }, [media_id, media_type]);
    return (
        <div className="content-card media-detail-body">
            <h2>Details</h2>
            <Table striped bordered hover variant="dark" className="tg">
                <tbody>
                    <tr>
                        <td className="tg-0lax">Genre</td>
                        <td className="tg-0lax">{genres}</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">Original Title</td>
                        <td className="tg-0lax">{media_title}</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">Production Companies</td>
                        <td className="tg-0lax">{productionCompanies}</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">Original Language</td>
                        <td className="tg-0lax">{originalLanguage}</td>
                    </tr>
                    <tr>
                        <td className="tg-0lax">Production Countries</td>
                        <td className="tg-0lax">{productionCountries}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}

export default MediaDetail
