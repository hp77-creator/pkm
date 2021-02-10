import fetch from 'node-fetch';
import semver from 'semver';

async function fetchPackage({name, reference}){
    if(semver.valid(reference)){
        return await fetchPackage(
            {
                name,
                reference: `https://registry.yarnpkg.com/${name}/-/${name}-${reference}.tgz`,
            }
        );
    }
    let response = await fetch(reference);

    if(!response.ok) throw new Error(`Could not fetch the package "${reference}"`);

    else await reponse.buffer();

}
