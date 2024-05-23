import { LookbookImageProps } from "./lookbook-image";

export type LookbookProps = {
    _id: string;    
    lookbookName: string;
    collectionInfo: string;
    lookbookImages: LookbookImageProps[];
    description: string;
    active: number;
    createdAt: string;
    updatedAt: string;
}