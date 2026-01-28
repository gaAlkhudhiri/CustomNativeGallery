import { ReactElement, createElement } from "react";
import { FlatList } from "react-native";
import { CustomStyle } from "src/CustomNativeGallery";
import { PaginationEnum } from "typings/CustomNativeGalleryProps";
interface GalleryListProps {
    data: any[] | undefined;
    isVertical: boolean;
    pagination: PaginationEnum;
    hasMoreItems: boolean | undefined;
    renderItem: ({ item }: { item: any }) => ReactElement;
    footerComponent: ReactElement | null;
    style: CustomStyle[];
    emptyComponent: ReactElement;
    scrollIndicator?: boolean;
    testID?: string;
    loadMoreItems?: () => void;
}

export const GalleryList = ({
    data,
    isVertical,
    pagination,
    hasMoreItems,
    renderItem,
    footerComponent,
    emptyComponent,
    style,
    scrollIndicator,
    testID,
    loadMoreItems
}: GalleryListProps) => (
    <FlatList
        data={data}
        keyExtractor={(item, index) => item.id ? `item-${item.id}` : `item-${index}`}
        renderItem={renderItem}
        horizontal={!isVertical}
        onEndReached={pagination === "virtualScrolling" && hasMoreItems ? loadMoreItems : undefined}
        onEndReachedThreshold={0.5}
        ListFooterComponent={footerComponent}
        style={style[0]?.container}
        ListEmptyComponent={emptyComponent}
        // contentContainerStyle={style[0]?.container}
        showsHorizontalScrollIndicator={!isVertical && scrollIndicator}
        showsVerticalScrollIndicator={isVertical && scrollIndicator}
        testID={testID}
    />
);