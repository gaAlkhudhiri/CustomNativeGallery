import { ReactElement, createElement } from "react";
import { FlatList } from "react-native";
import { PaginationEnum } from "typings/CustomNativeGalleryProps";
interface GalleryListProps {
    data: any[] | undefined;
    isVertical: boolean;
    pagination: PaginationEnum;
    hasMoreItems: boolean | undefined;
    renderItem: ({ item }: { item: any }) => ReactElement;
    footerComponent: ReactElement | null;
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
        ListEmptyComponent={emptyComponent}
        showsHorizontalScrollIndicator={!isVertical && scrollIndicator}
        showsVerticalScrollIndicator={isVertical && scrollIndicator}
        testID={testID}
    />
);