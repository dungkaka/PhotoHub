import { admin } from "../../config/firebase";
import * as stream from "stream";
import { Buffer } from "buffer";
const UUID = require('uuid/v4');

const uploadPicture = function(base64: any, postId: any, uid: any) {
    return new Promise( (resolve, reject) => {
        if (!base64 || !postId) {
            reject("news.provider#uploadPicture - Could not upload picture because at least one param is missing.");
        }

        let bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(base64, 'base64'));

        // Retrieve default storage bucket
        let bucket = admin.storage().bucket();

        // Create a reference to the new image file
        let file = bucket.file(`/news/${uid}_${postId}.jpg`);

        let uuid = UUID();
        bufferStream.pipe(file.createWriteStream({
            metadata: {
                contentType: 'image/jpeg',
                metadata: {
                    firebaseStorageDownloadTokens: uuid,
                }
            }
        }))
            .on('error', error => {
                reject(`news.provider#uploadPicture - Error while uploading picture ${JSON.stringify(error)}`);
            })

            .on('finish', async () => {
                // The file upload is complete.
                const urlImage = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid;
                const [metadata] = await bucket.file(`news/${uid}_${postId}.jpg`).getMetadata();
                bucket.file(`news/${uid}_${postId}.jpg`).getSignedUrl({
                    action: 'read',
                    expires: '11-11-2030'
                }, (error, url) => {
                    if (error) {
                        reject(`news.provider#uploadPicture - Error  ${JSON.stringify(error)}`);
                    }
                    resolve({
                        metadata: metadata,
                        signedUrl: url,
                        url: urlImage,
                    })
                });
            });
    })
};


export default uploadPicture;