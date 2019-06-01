import {firestoreRef} from "../../config/firebase";
import {Query, QuerySnapshot} from "@google-cloud/firestore";

class ImageDAO {
    private static imagesRef = firestoreRef.collection("images");
    // private static imagePagination = ImageDAO.imagesRef;
    // private static imageEndOfQuery: DocumentSnapshot;
    // private static imageByTagPagination: Query;
    // private static imageByTagEndOfQuery: DocumentSnapshot;


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

    // public static getPaginationImageFirst = async () => {
    //     const imageDataQuerySnapshot
    //         = await ImageDAO
    //         .imagePagination
    //         .get();
    //
    //     ImageDAO.imageEndOfQuery = imageDataQuerySnapshot.docs[imageDataQuerySnapshot.docs.length - 1];
    //     const last = ImageDAO.imageEndOfQuery;
    //
    //     const listImage: any[] = [];
    //     imageDataQuerySnapshot.forEach((doc) => {
    //         listImage.push({...doc.data(), image_id: doc.id});
    //     });
    //
    //     console.log(ImageDAO.imageEndOfQuery);
    //
    //     return {
    //         listImage,
    //         last
    //     };
    // };
    //
    // public static getPaginationImageAfter = async () => {
    //     if (ImageDAO.imageEndOfQuery) {
    //         const imageDataQuerySnapshot = await ImageDAO.imagePagination.startAfter(ImageDAO.imageEndOfQuery).get();
    //         ImageDAO.imageEndOfQuery = imageDataQuerySnapshot.docs[imageDataQuerySnapshot.docs.length - 1];
    //
    //         const listImage: any[] = [];
    //         imageDataQuerySnapshot.forEach((doc) => {
    //             listImage.push({...doc.data(), image_id: doc.id});
    //         });
    //
    //         return listImage;
    //     }
    //
    //     return [];
    // };

    public static findImageByTag = async (tags: any[]) => {
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

    // public static getImageByTagPaginationFirst = async (tags: any[]) => {
    //     let imageDataQuery: Query = ImageDAO.imagesRef;
    //     tags.forEach(tag => {
    //         if (tag !== false && tag !== "") {
    //             imageDataQuery = imageDataQuery.where(`tags.${tag}`, "==", true);
    //         }
    //     });
    //
    //     ImageDAO.imageByTagPagination = imageDataQuery.limit(2);
    //     const imageList = await ImageDAO.imageByTagPagination.get();
    //     ImageDAO.imageByTagEndOfQuery = imageList.docs[imageList.docs.length - 1];
    //
    //     const listImage: any[] = [];
    //     imageList.forEach((doc) => {
    //         const tagsModel = doc.data().tags;
    //         const tagsArray = [];
    //         for (const field in tagsModel) {
    //             tagsArray.push(field);
    //         }
    //         listImage.push({...doc.data(), tags: tagsArray});
    //     });
    //
    //     return listImage;
    // }
    //
    // public static getImageByTagPaginationAfter = async () => {
    //     if (ImageDAO.imageByTagEndOfQuery) {
    //         const imageList = await ImageDAO.imageByTagPagination.startAfter(ImageDAO.imageByTagEndOfQuery).get();
    //         ImageDAO.imageByTagEndOfQuery = imageList.docs[imageList.docs.length - 1];
    //
    //         const listImage: any[] = [];
    //         imageList.forEach((doc) => {
    //             const tagsModel = doc.data().tags;
    //             const tagsArray = [];
    //             for (const field in tagsModel) {
    //                 tagsArray.push(field);
    //             }
    //             listImage.push({...doc.data(), tags: tagsArray});
    //         });
    //
    //         return listImage;
    //     }
    //
    //     return [];
    //
    // }


}

export default ImageDAO;