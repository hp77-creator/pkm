import fetch from 'node-fetch';

async function fetchPackage(reference){
    let response = await fetch(reference);

    if(!response.ok) throw new Error(`Could not fetch the package "${reference}"`);

    else await reponse.buffer();

}
