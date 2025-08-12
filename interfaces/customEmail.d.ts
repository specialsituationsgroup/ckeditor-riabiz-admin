export type PK = number;

export type URL = string;

export type NativeAdLink = {
    text: string,
    url?: URL,
    bitly_url: URL,
};

export type Color = string;
export type DateString = string;

export type Timely = {
    start: DateString,
    end: DateString,
};

export type Ordered = {
    order: number,
}

export type NativeAdRestType = Timely & Ordered & {
    logo: URL,
    logo_url?: URL,
    logo_bitly_url?: URL,
    primary_color: Color,
    secondary_color: Color,
    tagline_color: Color,
    tagline: string,
    tagline_mobile: string,
    tracking_pixel?: URL,
    links: NativeAdLink[],
    name: string,
}