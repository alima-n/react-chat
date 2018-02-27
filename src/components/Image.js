import React, { Component } from 'react'
import { storage } from '../firebase'

class Image extends Component {

    state = {
        url: 'http://dev.nurgazieva.com/loader.svg'
    }

    setStateAsync = state =>
        new Promise(resolve => 
            this.setState(state, resolve)
        )
    
    async componentDidMount() {
        const {uri} = this.props
        const fileRef = storage.refFromURL(uri)

        this.setStateAsync({
            url: await storage.getMetadata(fileRef)
                .then(metadata => metadata.downloadURLs[0])
        })
    }

    render() {
        const src = this.state.url
        const { className, alt } = this.props
        return (
            <div>
                <a target="blank" href={src}>
                    <img className={className} src={src} alt={'Картинка от ' + alt} />
                </a>
            </div>
        )
    }
}

export default Image