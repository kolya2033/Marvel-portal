import { useState, useEffect } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'
import './charInfo.scss';

const  CharInfo = (props) => {

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    

    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar()
    }, [props.charId])
    
    const onCharLoaded = (char) => {
        setChar(char);
        setLoading(false);
        setError(false)
    }

    const onCharLoading = () => {
        setLoading(true);
    }

    const onError = () => {
        setError(true);
        setLoading(false);
    }

    const updateChar = () => {
        if(!props.charId) {
            return; 
        }
        onCharLoading()
        marvelService
            .getCharacter(props.charId)
            .then(onCharLoaded)
            .catch(onError)
    }

    const skeleton = char || error || loading ? null : <Skeleton/>
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null; 

    return (

        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )

}


const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char
    let imgStyle = {'objectFit': 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'contain'};
    }
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics for this character'}
                {
                    comics.map((item, i) => {
                        return(
                            <li key={i} className="char__comics-item">
                                <a href={item.resourceURI}>{item.name}</a>
                            </li>
                        )
                    })
                }
                
                
            </ul>
        </>
    )
}

export default CharInfo;