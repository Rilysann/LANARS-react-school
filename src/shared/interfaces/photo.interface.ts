export interface IPhoto {
    date: number;
    description: string;
    id: number;
    image: string;
    size: number;
    type: `image/${PhotoTypes}`;
}

type PhotoTypes = 'jpeg' | 'webp';