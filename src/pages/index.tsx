import { useState } from 'react';
import logo from '../logo.svg';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [valor, setValor] = useState('');

    const handleProcurar = async (e: any) => {
        setValor(e.target.value);
    };


    const onSubmit = async () => {
        
        setLoading(true);
        try{
            
            const requestHeaders = new Headers();
            requestHeaders.set('Content-Type', 'application/json;');
            requestHeaders.set('Accept', '*/*');
            requestHeaders.set('Access-Control-Allow-Origin', '*');
            requestHeaders.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            const response = await axios.get(`https://images-api.nasa.gov/search?q=${valor}`);
            const data = await response.data;
            if (data.collection.items) {
                setResults(data.collection.items);
                setLoading(false);
            }
        } 
        catch(e)
        {
            console.log("Erro", e);
            setLoading(false);
        }
        return true;
    };

    return (

        <div>
            <div>
                <input
                    type="search"
                    name="Procurar"
                    placeholder="Procurar imagens da NASA... (ex.: Moon)"
                    onChange={handleProcurar}
                />
                <button type="submit" role="button" onClick={onSubmit}>Procurar</button>
            </div>
            <br />
            {
                (loading) ? <div><img src={logo} className="App-logo" alt="logo" /></div>
            :
                (results?.length === 0) ? <div>Sem resultado.</div>
                :
                <div className='container'>
                    {results?.map((image: any) => (
                        <div key={image.data[0].nasa_id} className="left">
                            {
                                image.links && image.links.length > 0 ?
                                <div>
                                    <LazyLoadImage
                                    alt={image.data[0].title}
                                    height={image.height}
                                    src={image.links[0].href} // use normal <img> attributes as props
                                    width={400} />
                                    <div>{image.data[0].title} - {image.data[0].date_created}</div>
                                    <br />
                                </div>
                                :
                                <span></span>
                            }
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}