import { ReactElement, createElement, useCallback, useEffect, useMemo, useState } from "react";
import { Platform, Pressable, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

import { Style } from "@mendix/pluggable-widgets-tools";
import { CustomNativeGalleryProps } from "../typings/CustomNativeGalleryProps";
import { GalleryList } from "./components/GalleryList";

export interface CustomStyle extends Style {
    container: ViewStyle;
    label: TextStyle;
}

export function CustomNativeGallery(props: CustomNativeGalleryProps<CustomStyle>): ReactElement {
   const { datasource, pageSize, name, content, onClick, emptyPlaceholder, pagination, loadMoreButtonCaption, scrollDirection, scrollIndicator, filterList, searchText, filtersPlaceholder, style } = props;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const value = searchText?.value ?? "";
        setSearchQuery(value.trim().toLocaleLowerCase());
    }, [searchText?.value]);

    useEffect(() => {
        if (datasource.limit === Infinity) {
            datasource.setLimit(pageSize);
        }
    }, [datasource, pageSize]);

     const searchableAttributes = useMemo(
        () => filterList.map(f => f.filter),
        [filterList]
    );

    const filteredItems = useMemo(() => {
        if(!datasource.items || !searchQuery || searchableAttributes.length === 0){
            return datasource.items ?? [];
        }

        console.log("Searching for:", searchQuery);
        console.log("Searchable attributes:", searchableAttributes);

        return datasource.items.filter(item =>
            searchableAttributes.some(attr => {
                const value = attr?.get(item).value;
                console.log(`Checking item attribute value:`, value);
                return (
                    typeof value === "string" &&
                    (value as string).toLowerCase().includes(searchQuery)
                );
            })
        );
    }, [datasource.items, searchableAttributes, searchQuery]);

    const isVertical = scrollDirection === "vertical";

    const loadMoreItems = useCallback(() => {
        const nextLimit = (currentPage + 1) * pageSize;
        datasource.setLimit(nextLimit);
        setCurrentPage(currentPage + 1);
    }, [currentPage, datasource, pageSize]);

    /* --------------------------------------------------------------- */
    /* String oonly filtering
    /* --------------------------------------------------------------- */

   

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
        <View testID={`${name}`}>
            {filtersPlaceholder}
            <GalleryList
                data={filteredItems}
                isVertical={isVertical}
                pagination={pagination}
                style={style}
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
