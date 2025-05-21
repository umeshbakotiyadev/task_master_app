import { View, StyleSheet, RefreshControl, FlatList } from 'react-native'; // Removed unused Alert import
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ButtonX, MasterView, PressX, TaskDetailsCardItem, TextX } from '../../components'; // UI components
import { useAPIs, useThemeX } from '../../hooks'; // Custom hooks for API calls and theme
import { defStyObjType, taskListDataType } from '../../types'; // Type definitions
import { makeTaskListDataForLocalStoreFN } from '../../functions'; // Utility function for data transformation
import useZuStore from '../../store/useZuStore'; // Zustand store for task data
import { bSpace, btnHeight } from '../../utils'; // Utility constants (e.g., base spacing, button height)
import { PLUSH_IC } from '../../assets'; // SVG icon for the add button

/**
 * @description ListAllTaskController manages the display, filtering, and fetching of tasks.
 * It integrates with a Zustand store for state management, handles API calls,
 * and provides UI for filtering tasks by status and navigating to task details/add/edit screens.
 *
 * @param {object} props - Component props.
 * @param {object} props.navigation - Navigation object from React Navigation.
 */
const ListAllTaskController = ({ navigation }: any) => {

    // Destructure API functions from custom hook
    const { getUserDetailsAPI } = useAPIs();
    // Destructure task list data and setter from Zustand store
    const { setTaskListData, taskListData } = useZuStore();
    // Destructure theme-related properties and internationalization strings from custom hook
    const { top, col, str, defStyOBJ, cpSty, setToast } = useThemeX();
    // Generate styles based on the default style object and theme colors
    const sty = styFN(defStyOBJ);

    // State for managing pull-to-refresh loading indicator
    const [topLoading, setTopLoading] = useState<boolean>(false);
    // State for managing load-more (pagination) loading indicator (though not fully implemented here)
    const [bottomLoading, setBottomLoading] = useState<boolean>(false);
    // State to manage the current filter status:
    // null = All tasks, true = Completed tasks, false = Incomplete tasks
    const [status, setStatus] = useState<boolean | null>(null);

    // Ref to track if there are more pages of data to load (for pagination)
    const hasNextPageRef = useRef<boolean>(true);

    /**
     * @description Memoized array of tasks to display, filtered based on the `status` state.
     * `useMemo` is used to re-calculate this array only when `taskListData` or `status` changes,
     * preventing unnecessary re-renders of the FlatList.
     * Tasks are reversed to show the most recent ones first (assuming new tasks are added to the end).
     */
    const usersDataArr = useMemo((): Array<taskListDataType> => {
        return Object.values(taskListData)
            .filter((item) => status === null ? item : (item?.completed === status))
            .reverse();
    }, [taskListData, status]);

    /**
     * @description Fetches task data from the API.
     * Manages loading states for pull-to-refresh (`topRefresh`) and load-more (`bottomRefresh`).
     * Updates the `taskListData` in the Zustand store and handles API errors.
     *
     * @param {object} options - Options for the fetch operation.
     * @param {boolean} [options.topRefresh=false] - True if triggered by pull-to-refresh.
     * @param {boolean} [options.bottomRefresh=false] - True if triggered by load-more.
     */
    async function getUserDetails({ topRefresh = false, bottomRefresh = false }:
        { topRefresh?: boolean, bottomRefresh?: boolean; }) {

        // Set loading states based on the refresh type
        if (bottomRefresh) setBottomLoading(true);
        if (topRefresh) {
            hasNextPageRef.current = true; // Reset hasNextPageRef on top refresh to fetch from start
            setTopLoading(true);
        }
        // If there are no more pages to load, exit early
        if (!hasNextPageRef.current) return;

        try {
            // Await the API call
            const { res } = await getUserDetailsAPI();

            // Update hasNextPageRef based on the API response (assuming 'next' property indicates more data)
            hasNextPageRef.current = !!(res?.next);

            // If the response is an array, transform and set the task data in the store
            if (Array.isArray(res)) {
                setTaskListData(makeTaskListDataForLocalStoreFN(res));
            }
        } catch (error) {
            // Handle API errors by showing a toast message
            console.error("Failed to fetch user details:", error); // Log error for debugging
            setToast({ show: true, msg: str.SOMETHING_ITS_WRONG_PLZ_TRY_AGAIN });
        } finally {
            // Always reset loading states after the operation completes (success or failure)
            setBottomLoading(false);
            setTopLoading(false);
        }
    }

    /**
     * @description Memoized render function for each item in the FlatList.
     * Renders a `TaskDetailsCardItem` and navigates to the "TaskDetailsScr" on press.
     * `useCallback` prevents unnecessary re-creation of this function on every render.
     */
    const renderItem = useCallback(({ item, index }:
        { item: taskListDataType, index: number }) => (
        <TaskDetailsCardItem
            {...item} // Pass all properties of the task item as props
            onPress={() => navigation.navigate("TaskDetailsScr", item)} // Navigate to details screen on press
        />
    ), [navigation]); // Dependency: navigation object for navigating

    /**
     * @description useEffect hook to fetch initial task data when the component mounts.
     * It triggers a `topRefresh` to ensure fresh data is loaded.
     */
    useEffect(() => {
        getUserDetails({ topRefresh: true });
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <MasterView fixed hShow={false}>
            {/* FlatList component for rendering the scrollable list of tasks */}
            <FlatList
                data={usersDataArr} // Data source for the list
                // Header component for the FlatList, containing filter buttons
                ListHeaderComponent={
                    <>
                        {/* Only show filter buttons if there are tasks to display */}
                        {(usersDataArr.length > 0) && (
                            <View style={{ flexDirection: 'row', height: 20 + btnHeight, paddingBottom: 10 }}>
                                {/* "All" tasks filter button */}
                                <ButtonX
                                    text={str.ALL}
                                    onPress={() => { setStatus(null); }}
                                    cSty={{
                                        backgroundColor: status === null ? col.BTN_BGCOL : col.TRANSPARENT,
                                        borderWidth: undefined, // Remove border if present
                                    }}
                                    tSty={{ color: status === null ? col.BTN_TEXT_COL : col.BLACK }}
                                />
                                {/* "Completed" tasks filter button */}
                                <ButtonX
                                    text={str.COMPLETED}
                                    onPress={() => { setStatus(true); }}
                                    cSty={{
                                        backgroundColor: status === true ? col.BTN_BGCOL : col.TRANSPARENT,
                                        borderWidth: undefined,
                                    }}
                                    tSty={{ color: status === true ? col.BTN_TEXT_COL : col.BLACK }}
                                />
                                {/* "Incompleted" tasks filter button */}
                                <ButtonX
                                    text={str.INCOMPLETED}
                                    onPress={() => { setStatus(false); }}
                                    cSty={{
                                        backgroundColor: status === false ? col.BTN_BGCOL : col.TRANSPARENT,
                                        borderWidth: undefined,
                                    }}
                                    tSty={{ color: status === false ? col.BTN_TEXT_COL : col.BLACK }}
                                />
                            </View>
                        )}
                    </>
                }
                // Pull-to-refresh functionality
                refreshControl={
                    <RefreshControl
                        colors={[col.PRIMARY, col.PRIMARY, col.PRIMARY]} // Color of the refreshing indicator
                        tintColor={col.PRIMARY} // Color of the loading spinner on iOS
                        progressBackgroundColor={col.SECONDARY} // Background color of the loading spinner on Android
                        refreshing={topLoading} // Boolean to control refresh indicator visibility
                        onRefresh={() => getUserDetails({ topRefresh: true })} // Callback on pull-to-refresh
                    />
                }
                contentContainerStyle={{ padding: bSpace }} // Padding around the list content
                // Key extractor for list items. Using item.id is safer than index if available.
                // Assuming `item.id` is unique for each task from the API.
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem} // Function to render each item
                // Component rendered between list items for spacing
                ItemSeparatorComponent={() => <View style={{ height: bSpace / 2 }} />}
                // Component rendered when the list is empty
                ListEmptyComponent={() => {
                    // Only show "Records Not Found" if not currently loading
                    if (topLoading) return null;
                    return (
                        <View style={cpSty.emptyListMSG_cSty}>
                            <TextX text={str.RECORDS_NOT_FOUND} tSty={cpSty.emptyListMSG_tSty} />
                        </View>
                    );
                }}
            // Optional: Add onEndReached and onEndReachedThreshold for infinite scrolling
            // onEndReached={() => getUserDetails({ bottomRefresh: true })}
            // onEndReachedThreshold={0.5} // When to trigger onEndReached (0 to 1)
            />
            {/* Floating action button for adding a new task */}
            <PressX
                onPress={() => navigation.navigate("AddEditTaskScr")} // Navigate to add/edit task screen
                children={<PLUSH_IC color={col.WHITE} />} // Plus icon
                mSty={sty.addExpenseBtn_mSty} // Main style for the button container
                cSty={sty.addExpenseBtn_cSty} // Child style for the button's inner content/styling
            />
        </MasterView>
    );
};

export default ListAllTaskController;

/**
 * @description `styFN` is a function that returns a StyleSheet object.
 * It's defined outside the component to prevent re-creation on every render,
 * improving performance. It takes theme properties to create dynamic styles.
 *
 * @param {defStyObjType} defStyObj - Object containing default style properties from the theme.
 * @returns {object} A StyleSheet object containing various styles for the component.
 */
const styFN = ({ font, col, bottom }: defStyObjType) => StyleSheet.create({
    addExpenseBtn_mSty: {
        flex: undefined, // Override default flex behavior if MasterView applies it
        marginVertical: bSpace / 2,
        marginHorizontal: bSpace,
        position: 'absolute', // Position the button absolutely
        bottom: bSpace + bottom, // Position from the bottom, accounting for safe area
        right: 0, // Position from the right
    },
    addExpenseBtn_cSty: {
        padding: 15, // Padding around the icon
        backgroundColor: col.PRIMARY, // Background color of the button
        borderRadius: 50, // Make it a perfect circle
        shadowColor: "#000", // Add shadow for a lifted effect
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
