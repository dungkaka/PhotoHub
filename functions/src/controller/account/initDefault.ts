import CollectionDAO from "../../model/collection/collection.dao";

class InitDefault {
    private user: any;

    constructor (user: any) {
        this.user = user;
    }

    public init = async () => {
        await this.initFavouriteCollection(this.user);
    };

    private initFavouriteCollection = async (user: any) => {
        const collectionDAO = new CollectionDAO(user.id);
        const favouriteCollection = collectionDAO.convertToCollectionModel(
            {
                name: "Favourite",
            }
        )

        await collectionDAO.createNewCollection(favouriteCollection);
    }
}

export default InitDefault;