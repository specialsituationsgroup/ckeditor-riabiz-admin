export type AdProps = {
    align?: "center",
    target?: { [key: string]: string }
};
export type AdMapping = {
    viewport: number[];
    sizes: Size[];
  };
  
export type AdComponent = React.FunctionComponent<AdProps>;

export type NativeAdComponent = {
    order: 1 | 2 | 3,
};

export type AdMap = GoogleAdMap | NativeAdMap;

export type NativeAdMap = {
    type: "native";
    ad: NativeAdComponent;
};

export type GoogleAdMap = {
    type: "google";
    ad: AdComponent,
};
