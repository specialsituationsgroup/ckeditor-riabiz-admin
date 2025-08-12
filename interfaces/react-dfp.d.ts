/// <reference types="google-publisher-tag" />
declare module "react-dfp" {
    export type GPTEvent = {};

    export interface DFPEventData {
        slotId: string;
        /* Describe the GPT Event data */
        event: GPTEvent;
    }

    export type Size = [number, number] | string;

    export type SizeMapping = {
        viewport: number[];
        sizes: Size[];
    };

    export type AdSenseAttributes = {
        [key: string]: string;
    };

    export type TargetingArguments = {
        [key: string]: string;
    };

    export interface AdSlotProps {
        dfpNetworkId?: string;
        adUnit?: string;
        sizes?: Size[];
        renderOutOfThePage?: boolean;
        sizeMapping?: SizeMapping[];
        fetchNow?: boolean;
        adSenseAttributes?: AdSenseAttributes;
        targetingArguments?: TargetingArguments;
        onSlotRender?: (dfpEventData: DFPEventData) => void;
        onSlotRegister?: (dfpEventData: DFPEventData) => void;
        onSlotIsViewable?: (dfpEventData: DFPEventData) => void;
        onSlotVisibilityChanged?: (dfpEventData: DFPEventData) => void;
        shouldRefresh?: () => boolean;
        slotId?: string;
        className?: string;
    }

    type LazyLoad = {
        fetchMarginPercent?: number;
        renderMarginPercent?: number;
        mobileScaling?: number;
    };

    export interface DFPSlotsProviderProps {
        children: ReactElement;
        autoLoad?: boolean;
        autoReload?: {
            dfpNetworkId?: boolean;
            personalizedAds?: boolean;
            singleRequest?: boolean;
            disableInitialLoad?: boolean;
            adUnit?: boolean;
            sizeMapping?: boolean;
            adSenseAttributes?: boolean;
            targetingArguments?: boolean;
            collapseEmptyDivs?: boolean;
            lazyLoad?: boolean;
        };
        dfpNetworkId: string;
        personalizedAds?: boolean;
        singleRequest?: boolean;
        disableInitialLoad?: boolean;
        adUnit?: string;
        sizeMapping?: SizeMapping[];
        adSenseAttributes?: AdSenseAttributes;
        targetingArguments?: TargetingArguments;
        collapseEmptyDivs?: boolean;
        lazyLoad?: boolean | LazyLoad;
    }
    // needed in order for anchor ads to work
    namespace googletag {
        namespace enums {
            enum OutOfPageFormat {
                BOTTOM_ANCHOR,
                INTERSTITIAL,
                REWARDED,
                TOP_ANCHOR,
            }
        }

        interface Service {
            addEventListener(arg0: string, arg1: (event: any) => void): unknown;
            setTargeting: (key: string, value: string | string[]) => Service;
            refresh: (slots?: Slot[]) => void;
        }
        interface Slot {
            addService: (service: Service) => Slot;
            setClickUrl: (url: string) => Slot;
            defineSizeMapping: (sizeMapping: SizeMapping[]) => Slot;
        }

        export interface Googletag {
            cmd: Array<() => void>;
            apiReady: boolean;
            enums: typeof enums;
            defineOutOfPageSlot: (
                adUnitPath: string,
                div: string | enums.OutOfPageFormat
            ) => Slot | null;
            pubads: () => Service;
            enableServices: () => void;
            display: (optDiv?: string) => void;
            defineSlot: (
                adUnitPath: string,
                adSizes: Size[],
                optDiv?: string
            ) => Slot | null;
            sizeMapping: () => SizeMappingBuilder;
        }
    }

    export interface SizeMappingBuilder {
        addSize: (
            viewportSize: number[],
            slotSize: Size[]
        ) => SizeMappingBuilder;
        build: () => null | SizeMapping[];
    }

    export interface DFPManager {
        getGoogletag: () => Promise<googletag.Googletag>;

        load: (...slotId: string[]) => void;

        refresh: (...slotId: string[]) => void;

        reload: (...slotId: string[]) => void;

        configureSingleRequest: (enable?: boolean) => void;

        configureLazyLoad: (enable: boolean, config?: LazyLoad) => void;

        singleRequestIsEnabled: () => boolean;

        configurePersonalizedAds: (enable?: boolean) => void;

        setAdSenseAttributes: (adSenseAttributes: AdSenseAttributes) => void;

        getAdSenseAttributes: () => {
            [key: string]: string;
        };

        setAdSenseAttribute: (name: string, value: string) => void;

        getAdSenseAttribute: (name: string) => string;

        setTargetingArguments: (targetingArguments: TargetingArguments) => void;

        setCollapseEmptyDivs: (enable: boolean | null | undefined) => void;
    }
    export const DFPManager: DFPManager;
    export class DFPSlotsProvider extends Component<DFPSlotsProviderProps> {}
    export class AdSlot extends Component<AdSlotProps> {}
}
