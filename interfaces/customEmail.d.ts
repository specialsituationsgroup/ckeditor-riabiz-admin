/*
 * Admin Writing Interface
 * Copyright (C) 2024 RIABiz
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, see <https://www.gnu.org/licenses/>.
 */

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