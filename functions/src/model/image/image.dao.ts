import {firestoreRef} from "../../config/firebase";
import {Query, QuerySnapshot} from "@google-cloud/firestore";
import HttpException from "../../exception/HttpException";

class ImageDAO {
    private static imagesRef = firestoreRef.collection("images");

    public static getPaginationImage = async (imageId: string) => {

        let imageDataQuerySnapshot: QuerySnapshot;

        if (imageId) {
            const preImage
                = await ImageDAO
                .imagesRef
                .doc(imageId)
                .get();

            imageDataQuerySnapshot = await ImageDAO.imagesRef.startAfter(preImage).limit(40).get();

        } else {
            imageDataQuerySnapshot = await ImageDAO.imagesRef.limit(40).get();
        }

        const listImage: any[] = [];
        imageDataQuerySnapshot.forEach((doc) => {
            const tagsModel = doc.data().tags;
            const tagsArray = [];
            for (const field in tagsModel) {
                tagsArray.push(field);
            }
            listImage.push({...doc.data(), id: doc.id, tags: tagsArray});
        });

        return listImage;
    }

    public static addImage = async (images: any) => {
        const imageRef = await ImageDAO.imagesRef.add(images);
        const image = await imageRef.get();
        return image.data();
    };

    public static getAllImage = async () => {
        const userDataQuerySnapshot = await ImageDAO.imagesRef.get();

        const listImage: any[] = [];
        userDataQuerySnapshot.forEach((doc) => {
            const tagsModel = doc.data().tags;
            const tagsArray = [];
            for (const field in tagsModel) {
                tagsArray.push(field);
            }
            listImage.push({...doc.data(), id: doc.id, tags: tagsArray});
        });

        return listImage;
    }

    public static getImageByTag = async (tags: any[]) => {
        let imageDataQuery: Query = ImageDAO.imagesRef;
        tags.forEach(tag => {
            if (tag !== false && tag !== "") {
                imageDataQuery = imageDataQuery.where(`tags.${tag}`, "==", true);
            }
        });

        const imageList = await imageDataQuery.get();

        const listImage: any[] = [];
        imageList.forEach((doc) => {
            const tagsModel = doc.data().tags;
            const tagsArray = [];
            for (const field in tagsModel) {
                tagsArray.push(field);
            }
            listImage.push({...doc.data(), tags: tagsArray, id: doc.id});
        });

        return listImage;
    }

    public static getPaginationImageByTag = async (tags: any[], imageId: string) => {
        let imageList: QuerySnapshot;

        let imageDataQuery: Query = ImageDAO.imagesRef;
        tags.forEach(tag => {
            if (tag !== false && tag !== "") {
                imageDataQuery = imageDataQuery.where(`tags.${tag}`, "==", true);
            }
        });

        if(imageId) {
            const preImage
                = await ImageDAO
                .imagesRef
                .doc(imageId)
                .get();

            imageList = await imageDataQuery.startAfter(preImage).limit(40).get();
        } else {
            imageList = await imageDataQuery.limit(40).get();
        }

        const listImage: any[] = [];
        imageList.forEach((doc) => {
            const tagsModel = doc.data().tags;
            const tagsArray = [];
            for (const field in tagsModel) {
                tagsArray.push(field);
            }
            listImage.push({...doc.data(), tags: tagsArray, id: doc.id});
        });

        return listImage;
    }

    public static likeImage = async (userId: string, imageId: any) => {
        const imageRef = ImageDAO.imagesRef.doc(imageId);
        const image = await imageRef.get();

        if(image) {
            // @ts-ignore
            let like_by = image.data().like_by;
            // @ts-ignore
            let likes = image.data().likes;

            if (!like_by.includes(userId)) {
                like_by.push(userId);
                likes += 1;

                await imageRef.set({
                    // like_by: admin.firestore.FieldValue.arrayUnion("user_2"),
                    // likes: admin.firestore.FieldValue.increment(1),
                    like_by,
                    likes,
                }, {merge: true});

                return {
                    message: "Completed like image !"
                };
            } else {
                throw new HttpException(400, "User already like this image");
            }
        } else {
            throw new HttpException(400, "Image can not found");
        }
    }

    public static unLikeImage = async (userId: string, imageId: any) => {
        const imageRef = ImageDAO.imagesRef.doc(imageId);
        const image = await imageRef.get();

        if(image) {
            // @ts-ignore
            let like_by = image.data().like_by;
            // @ts-ignore
            let likes = image.data().likes;

            if (like_by.includes(userId)) {
                like_by = like_by.filter((item: any) => {
                    return item !== userId;
                });
                likes -= 1;

                await imageRef.set({
                    // like_by: admin.firestore.FieldValue.arrayUnion("user_2"),
                    // likes: admin.firestore.FieldValue.increment(1),
                    like_by,
                    likes,
                }, {merge: true});

                return {
                    message: "Completed unlike image !"
                };
            } else {
                throw new HttpException(400, "User have not like this image yet");
            }
        } else {
            throw new HttpException(400, "Image can not found");
        }
    }


}

export default ImageDAO;