export interface IPhoto {
    date: number;
    description: string | undefined;
    id: number;
    image: string;
    size: number;
    type: `image/${PhotoTypes}`;
}

type PhotoTypes = 'jpeg' | 'webp';