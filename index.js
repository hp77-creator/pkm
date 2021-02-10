import fetch from 'node-fetch';
import semver from 'semver';
import fs from 'fs-extra';

async function fetchPackage({name, reference}){
    if(semver.valid(reference)){
        return await fetchPackage(
            {
                name,
                reference: `https://registry.yarnpkg.com/${name}/-/${name}-${reference}.tgz`,
            }
        );
    }

    if(['/', './', '../'].some(prefix => reference.startsWith(prefix))){
        return await fs.readFile(reference);
    }
    let response = await fetch(reference);

    if(!response.ok) throw new Error(`Could not fetch the package "${reference}"`);

    else await reponse.buffer();

}
