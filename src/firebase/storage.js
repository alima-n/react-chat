import { storage } from './firebase'

export const refFromURL = (URL) =>
    storage.refFromURL(URL)

export const getMetadata = (ref) => 
    ref.getMetadata()