import { Alert, StyleSheet, View } from 'react-native'; // Removed unused Text and FlatList, RefreshControl imports
import React, { useMemo } from 'react';
import { defStyObjType, taskListDataType } from '../types'; // Type definitions for styles and task data
import { ButtonX, MasterView, TextX } from '../components'; // UI components
import { useThemeX } from '../hooks'; // Custom hook to access theme-related properties
import { bSpace } from '../utils'; // Utility constants (e.g., base spacing)
import { _HEIGHT, Size } from '../functions'; // Utility functions (e.g., screen height, sizing)
import useZuStore from '../store/useZuStore'; // Zustand store for task data

/**
 * @description TaskDetailsController displays the full details of a selected task.
 * It provides options to edit or delete the task and integrates with the Zustand store
 * for task data management.
 *
 * @param {object} props - Component props.
 * @param {object} props.route - Route object from React Navigation, containing the task item parameters.
 * @param {object} props.navigation - Navigation object from React Navigation.
 */
const TaskDetailsController = ({ route, navigation }: any) => {

    // Determine if the component is in edit mode (though not directly used for rendering here,
    // it's a pattern from AddEditTaskController)
    const _edit = Boolean(route?.params?._edit);
    // Extract parameters from the route. This likely contains the ID of the task to display.
    const _itemParams: taskListDataType = route?.params || {}; // Renamed from _itemParams̉ for consistency

    // Destructure task list setter and data from Zustand store
    const { setResetTaskListData, taskListData } = useZuStore();
    // Destructure theme-related properties and internationalization strings from custom hook
    const { top, col, str, defStyOBJ, bottom } = useThemeX();
    // Generate styles based on the default style object and theme colors
    const sty = styFN(defStyOBJ);

    /**
     * @description Memoized task item retrieved from the `taskListData` store using the ID
     * from `_itemParams`. `useMemo` ensures this task object is re-calculated only when
     * `_itemParams` (route params) or `taskListData` (store state) changes.
     * This ensures the displayed details are always up-to-date with the store.
     */
    const _item: taskListDataType = useMemo(() =>
        taskListData[_itemParams?.id ?? ""],
        [_itemParams, taskListData]
    );

    /**
     * @description Deletes the current task from the Zustand store.
     * It creates a temporary copy of the task list, removes the task by its ID,
     * updates the store, and then navigates back.
     */
    async function deleteTask() {
        let temp = { ...taskListData }; // Create a mutable copy of the task list
        // Check if the item has an ID and then delete it from the temporary list
        _item?.id && delete temp[_item.id];
        // Update the Zustand store with the modified task list
        setResetTaskListData(temp);
        // Navigate back to the previous screen (e.g., task list)
        navigation.goBack();
    }

    return (
        <MasterView
            title={str?.TASK_DETAILS} // Set the header title for the screen
            style={{ padding: bSpace, paddingBottom: bSpace + bottom }} // Apply padding, accounting for safe area
        >
            <View style={sty.mC}>
                {/* Display Task Title */}
                <TextX text={_item?.title} tSty={sty.titleTSty} />
                {/* Conditionally display Task Description if available */}
                {_item?.description && (
                    <View style={sty.descriptionCSty}>
                        <TextX text={_item?.description} tSty={sty.descriptionTSty} />
                    </View>
                )}
            </View>
            {/* Edit Task Button */}
            <ButtonX
                text={str.EDITE} // Button text
                transparent // Make button transparent (likely styled by `mSty`)
                mSty={{ flex: undefined, marginVertical: bSpace }} // Override default flex and add vertical margin
                onPress={() => navigation.navigate("AddEditTaskScr", { _edit: true, _item })} // Navigate to Add/Edit screen in edit mode
            />
            {/* Delete Task Button */}
            <ButtonX
                text={str.DELETE} // Button text
                mSty={{ flex: undefined }} // Override default flex
                onPress={() => {
                    // Show a confirmation alert before deleting the task
                    Alert.alert(str.DELETE, str.ARE_YOU_SURE_REMOVE_TASK, [
                        {
                            onPress: deleteTask, // Call deleteTask function on confirm
                            style: 'destructive', // Style the button as destructive (red)
                            text: str.DELETE
                        },
                        {
                            style: 'cancel', // Style the button as cancel
                            text: str.CANCEL
                        },
                    ]);
                }}
            />
        </MasterView>
    );
};

export default TaskDetailsController;

/**
 * @description `styFN` is a function that returns a StyleSheet object.
 * It's defined outside the component to prevent re-creation on every render,
 * improving performance. It takes theme properties to create dynamic styles.
 *
 * @param {defStyObjType} defStyObj - Object containing default style properties from the theme.
 * @returns {object} A StyleSheet object containing various styles for the component.
 */
const styFN = ({ font, col, bottom }: defStyObjType) => StyleSheet.create({
    mC: {
        padding: bSpace, // Inner padding
        width: "100%", // Full width
        backgroundColor: col.WHITE02, // Background color
        borderWidth: 1, // Border
        borderRadius: bSpace, // Rounded corners
        borderColor: col.BLACK02, // Border color
    },
    titleTSty: {
        fontFamily: font.SEMI_BOLD, // Font family for title
        fontSize: Size(15), // Font size for title
        color: col.BLACK, // Text color for title
        textTransform: 'capitalize' // Capitalize first letter of each word
    },
    descriptionCSty: {
        paddingVertical: bSpace / 2, // Vertical padding
        paddingHorizontal: bSpace, // Horizontal padding
        backgroundColor: col.BLACK005, // Background color
        borderRadius: bSpace, // Rounded corners
        marginTop: 5, // Top margin
        flex: 1, // Take available vertical space
        minHeight: _HEIGHT * .3 // Minimum height for description container
    },
    descriptionTSty: {
        fontFamily: font.REGULAR, // Font family for description
        fontSize: Size(13), // Font size for description
        color: col.BLACK, // Text color for description
        textTransform: 'capitalize', // Capitalize first letter of each word
    },
});
