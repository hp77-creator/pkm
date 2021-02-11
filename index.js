import fetch from 'node-fetch';
import semver from 'semver';
import fs from 'fs-extra';

import {readPackageJsonFromArchive} from './utilities.js';


async function getPackageDependencies({name, reference}){
    let packageBuffer = await fetchPackage({name, reference});
    let packageJson = JSON.parse(await readPackageJsonFromArchive(packageBuffer));


    let dependencies = packageJson.dependencies || {};

    return Object.keys(dependencies).map(name => {
        return {name, reference: dependencies[name]};
    });
}


async function getPinnedReferences({name, reference}){
    if(semver.validRange(reference) && !semver.valid(reference)){
        let response = await fetch(`https://registry.yarnpkg.com/${name}`);
        let info = await response.json();

        let versions = Object.keys(info.versions);
        let maxSatisfying = semver.maxSatisfying(versions, reference);

        if(maxSatisfying == null) throw new Error(
            `Couldn't find any package with the name "${name}" matching reference "${reference}"`
        );

        reference = maxSatisfying;
    }

    return {name, reference};

    
}

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
