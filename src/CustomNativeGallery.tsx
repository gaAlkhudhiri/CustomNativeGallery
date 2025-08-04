import { ReactElement, createElement, useCallback, useEffect, useState } from "react";
import { Platform, Pressable, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { Style } from "@mendix/pluggable-widgets-tools";
import { CustomNativeGalleryProps } from "../typings/CustomNativeGalleryProps";
import { GalleryList } from "./components/GalleryList";

export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
}

export function CustomNativeGallery(props: CustomNativeGalleryProps<CustomStyle>): ReactElement {
   const { datasource, pageSize, name, content, onClick, emptyPlaceholder, pagination, loadMoreButtonCaption, scrollDirection, scrollIndicator, style } = props;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (datasource.limit === Infinity) {
            datasource.setLimit(pageSize);
        }
    }, [datasource, pageSize]);

    const isVertical = scrollDirection === "vertical";

    const loadMoreItems = useCallback(() => {
        const nextLimit = (currentPage + 1) * pageSize;
        datasource.setLimit(nextLimit);
        setCurrentPage(currentPage + 1);
    }, [currentPage, datasource, pageSize]);

    const handlePress = useCallback(() => {
        if (onClick && "execute" in onClick && typeof onClick.execute === "function") {
            onClick.execute();
        }
    }, [onClick]);

    const renderListItem = useCallback(
        ({item}: { item: any}) => {
            const onPress = onClick ? () => handlePress() : undefined;

            if(content){
                return (
                    <Pressable onPress={onPress}>
                        {content.get(item)}
                    </Pressable>
                )
            }

            return (
                <Pressable onPress={onPress}>
                    <Text>{JSON.stringify(item)}</Text>
                </Pressable>
            )
        },
        [content, handlePress, onClick]
    );

    const renderFooter = (): ReactElement | null => {
        if (pagination === "buttons" && datasource.hasMoreItems) {
            const caption = loadMoreButtonCaption?.value ?? "Load more";
            const Button = Platform.OS === "android" ? Pressable : TouchableOpacity;
            return (
                <Button onPress={loadMoreItems}>
                    <Text>{caption}</Text>
                </Button>
            );
        }
        return null;
    };

    const renderEmpty = (): ReactElement => (
        <View>{emptyPlaceholder}</View>
    );

    return (
        <View style={style[0]?.container} testID={`${name}`}>
            {/* <FlatList
                data={datasource.items}
                keyExtractor={item => item.id ?? JSON.stringify(item)}
                renderItem={renderListItem}
                horizontal={!isVertical}
                onEndReached={pagination === "virtualScrolling" && datasource.hasMoreItems ? loadMoreItems : undefined}
                ListFooterComponent={renderFooter()}
                ListEmptyComponent={renderEmpty}
                refreshing={false}
                showsHorizontalScrollIndicator={!isVertical && scrollIndicator}
                showsVerticalScrollIndicator={isVertical && scrollIndicator}
                testID={`${name}-list`}
            /> */}
            <GalleryList
                data={datasource.items}
                isVertical={isVertical}
                pagination={pagination}
                hasMoreItems={datasource.hasMoreItems}
                renderItem={renderListItem}
                footerComponent={renderFooter()}
                emptyComponent={renderEmpty()}
                scrollIndicator={scrollIndicator}
                testID={`${name}-list`}
                loadMoreItems={loadMoreItems}
            />
        </View>
    );
}
