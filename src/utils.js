
import imghash from 'imghash';
import leven from 'leven';

const standard = 20;
const gap = 0.5;

export const getVideoHash = (v, c, w, h) => {
    c.drawImage(v,0,0,w,h);
    // Grab the pixel data from the backing canvas
    var data = c.getImageData(0,0,w,h);
    const hash = imghash.hashRaw(data, 32);
    return hash; 
}

export const getDiffMap = (hash1, hash2) => {
    let index1 = 0;
    let index2 = 0;
    let diffMap = [];
    while(index1 < hash1.length && index2 < hash2.length) {
        if (isSimilar(hash1[index1], hash2[index2])) {
            let diff = {
                time : (index1 + 1) * gap,
                index1: index1,
                index2: index2,
                distance: leven(hash1[index1], hash2[index2]),
                type: 'same',
            }
            diffMap.push(diff);
            index1++;
            index2++;
        } else {
// store in map to optimize
            let isIndex1New = checkIfNew(hash1[index1], hash2);
            let isIndex2New = checkIfNew(hash2[index2], hash1);

            let diff = {
                time : (index1 + 1) * gap,
                index1: index1,
                index2: index2,
                distance: leven(hash1[index1], hash2[index2]),
            }

            if (isIndex1New && isIndex2New) {
                diff.type = 'replace';
                index1++;
                index2++;
            } else if (isIndex1New && !isIndex2New) {
                diff.type = 'add';
                index1++;
            } else if (!isIndex1New && isIndex2New) {
                diff.type = 'remove';
                index2++;
            } else {
                console.log('same');
                index1++;
                index2++;
            }            
            diffMap.push(diff);
        }
    }
    return diffMap;

}

const checkIfNew = (hash, hashMap) => {
    for (var i = 0; i < hashMap.length; i++) {
        if (isSimilar(hash, hashMap[i])) {
            return false;
        }
    }
    return true;
}

const isSimilar = (hash1, hash2) => {
    let distance = leven(hash1, hash2);
    //console.log('distance is', distance);
    if (distance < standard) {
        return true;
    } else {
        return false;
    }
}