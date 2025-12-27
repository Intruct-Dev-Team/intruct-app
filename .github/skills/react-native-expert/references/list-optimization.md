List Optimization

> Reference for: React Native Expert
> Load when: FlatList performance memo lists

## Optimized FlatList

```typescript
import React, { memo, useCallback } from "react";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

interface Item {
  id: string;
  title: string;
  subtitle: string;
}

const ITEM_HEIGHT = 72;

const styles = StyleSheet.create({
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
});

// Memoized list item
const ListItem = memo(function ListItem({
  item,
  onPress,
}: {
  item: Item;
  onPress: (id: string) => void;
}) {
  return (
    <Pressable onPress={() => onPress(item.id)} style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </Pressable>
  );
});

export function OptimizedList({ data }: { data: Item[] }) {
  const handlePress = useCallback((id: string) => {
    console.log("Selected:", id);
  }, []);

  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => <ListItem item={item} onPress={handlePress} />,
    [handlePress]
  );

  const keyExtractor = useCallback((item: Item) => item.id, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={10}
      updateCellsBatchingPeriod={50}
    />
  );
}
```

## SectionList

```typescript
import React, { useCallback } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";

// Reuse Item, renderItem, keyExtractor from the Optimized FlatList example above.

interface Section {
  title: string;
  data: Item[];
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
});

export function GroupedList({ sections }: { sections: Section[] }) {
  const renderSectionHeader = useCallback(
    ({ section }: { section: Section }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    ),
    []
  );

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={keyExtractor}
      stickySectionHeadersEnabled
    />
  );
}
```

## Pull to Refresh

```typescript
import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl } from "react-native";

type Props = {
  data: Item[];
  onRefresh: () => Promise<void>;
};

export function RefreshableList({ data, onRefresh }: Props) {
  // Reuse renderItem/keyExtractor from OptimizedList above.
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    />
  );
}
```

## Infinite Scroll

```typescript
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";

// Consumer-supplied helper.
// illustrative
async function fetchMoreItems(offset: number): Promise<Item[]> {
  void offset;
  return [];
}

const styles = StyleSheet.create({
  loader: {
    paddingVertical: 16,
  },
});

export function InfiniteList() {
  // Reuse renderItem/keyExtractor from OptimizedList above.
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await fetchMoreItems(data.length);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setData((prev) => [...prev, ...newItems]);
      }
    } finally {
      setLoading(false);
    }
  }, [data.length, hasMore, loading]);

  const renderFooter = useCallback(() => {
    if (!loading) return null;
    return <ActivityIndicator style={styles.loader} />;
  }, [loading]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
}
```

## FlashList (Alternative)

```typescript
import React from "react";
import { Text } from "react-native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

export function FastList({ data }: { data: Item[] }) {
  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <Text>{item.title}</Text>
  );

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={72}
      keyExtractor={(item) => item.id}
    />
  );
}
```

## Quick Reference

| Prop                    | Purpose                         |
| ----------------------- | ------------------------------- |
| `removeClippedSubviews` | Unmount off-screen items        |
| `maxToRenderPerBatch`   | Items per render batch          |
| `windowSize`            | Render window multiplier        |
| `initialNumToRender`    | Initial items to render         |
| `getItemLayout`         | Skip measurement (fixed height) |

| Optimization    | When                    |
| --------------- | ----------------------- | ------------------- |
| `memo()`        | All list items          |
| `useCallback`   | renderItem keyExtractor |
| `getItemLayout` | Fixed height items      |
| `FlashList`     | Very large lists        | # List Optimization |

> Reference for: React Native Expert
> Load when: FlatList, performance, memo, lists

## Optimized FlatList

```typescript
import { FlatList, ListRenderItem } from "react-native";
import { memo, useCallback } from "react";

interface Item {
  id: string;
  title: string;
  subtitle: string;
}

// Memoized list item
const ListItem = memo(function ListItem({
  item,
  onPress,
}: {
  item: Item;
  onPress: (id: string) => void;
}) {
  return (
    <Pressable onPress={() => onPress(item.id)} style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </Pressable>
  );
});

function OptimizedList({ data }: { data: Item[] }) {
  // Memoize callbacks
  const handlePress = useCallback((id: string) => {
    console.log("Selected:", id);
  }, []);

  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => <ListItem item={item} onPress={handlePress} />,
    [handlePress]
  );

  const keyExtractor = useCallback((item: Item) => item.id, []);

  // Fixed height for getItemLayout
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      // Performance props
      removeClippedSubviews
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={10}
      updateCellsBatchingPeriod={50}
    />
  );
}

const ITEM_HEIGHT = 72;
```

## SectionList

```typescript
import { SectionList } from "react-native";

interface Section {
  title: string;
  data: Item[];
}

function GroupedList({ sections }: { sections: Section[] }) {
  const renderSectionHeader = useCallback(
    ({ section }: { section: Section }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    ),
    []
  );

  return (
    <SectionList
      sections={sections}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={keyExtractor}
      stickySectionHeadersEnabled
    />
  );
}
```

## Pull to Refresh

```typescript
function RefreshableList({ data, onRefresh }: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }, [onRefresh]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#007AFF"
        />
      }
    />
  );
}
```

## Infinite Scroll

```typescript
function InfiniteList() {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const newItems = await fetchMoreItems(data.length);

    if (newItems.length === 0) {
      setHasMore(false);
    } else {
      setData((prev) => [...prev, ...newItems]);
    }
    setLoading(false);
  }, [data.length, loading, hasMore]);

  const renderFooter = useCallback(() => {
    if (!loading) return null;
    return <ActivityIndicator style={styles.loader} />;
  }, [loading]);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
}
```

## FlashList (Alternative)

```typescript
import { FlashList } from "@shopify/flash-list";

function FastList({ data }: { data: Item[] }) {
  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={72}
      keyExtractor={keyExtractor}
    />
  );
}
```

## Quick Reference

| Prop                    | Purpose                         |
| ----------------------- | ------------------------------- |
| `removeClippedSubviews` | Unmount off-screen items        |
| `maxToRenderPerBatch`   | Items per render batch          |
| `windowSize`            | Render window multiplier        |
| `initialNumToRender`    | Initial items to render         |
| `getItemLayout`         | Skip measurement (fixed height) |

| Optimization    | When                     |
| --------------- | ------------------------ |
| `memo()`        | All list items           |
| `useCallback`   | renderItem, keyExtractor |
| `getItemLayout` | Fixed height items       |
| `FlashList`     | Very large lists         |
