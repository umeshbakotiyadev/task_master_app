import { StyleSheet, TextInput, View } from 'react-native';
import React, { useRef, useState } from 'react';
import useZuStore from '../store/useZuStore'; // Zustand store for task data
import { useThemeX } from '../hooks'; // Custom hook to access theme-related properties
import { defStyObjType, taskListDataType } from '../types'; // Type definitions for styles and task data
import { bSpace } from '../utils'; // Utility constants (e.g., base spacing)
import { ButtonX, MasterView, SwitchX, TextInputX, TextX } from '../components'; // UI components
import { _HEIGHT, generateUniqueID, regex, Size } from '../functions'; // Utility functions (e.g., screen height, unique ID generation, regex, sizing)
import DatePicker from 'react-native-date-picker'; // Third-party date picker component

/**
 * @description AddEditTaskController handles the creation and editing of tasks.
 * It provides a form for inputting task details, performs validation,
 * and updates the task list in the Zustand store.
 *
 * @param {object} props - Component props.
 * @param {object} props.route - Route object from React Navigation, containing parameters like _edit and _item.
 * @param {object} props.navigation - Navigation object from React Navigation.
 */
const AddEditTaskController = ({ route, navigation }: any) => {

    // Determine if the component is in edit mode based on route parameters
    const _edit = Boolean(route?.params?._edit);
    // Get the task item data if in edit mode, otherwise an empty object
    const _item: taskListDataType = route?.params?._item || {};

    // Destructure task list setter and data from Zustand store
    const { setResetTaskListData, taskListData } = useZuStore();
    // Destructure theme-related properties and internationalization strings from custom hook
    const { top, col, str, defStyOBJ, setToast, font } = useThemeX();
    // Generate styles based on the default style object and theme colors
    const sty = styFN(defStyOBJ);

    // State for task title input
    const [taskTitle, setTaskTitle] = useState<string>(_item?.title || "");
    // State for task description input
    const [desc, setDesc] = useState<string>(_item?.description || "");
    // State to control the visibility of the DatePicker modal
    const [isDatePickerVisible, setIsDatePickerVisible] = useState<boolean>(false);
    // State to store the selected due date (initialized from _item or null)
    const [dueDate, setDueDate] = useState<Date | null>(_item?.dueDate ? new Date(_item?.dueDate) : null);
    // State for task completion status
    const [completed, setCompleted] = useState<boolean>(_item?.completed || false);

    // Ref for the description TextInput to allow programmatic focus
    const descRef = useRef<TextInput>(null);

    /**
     * @description Saves the task details to the local store (Zustand).
     * It handles both creating new tasks and updating existing ones.
     * Performs basic form validation before saving.
     */
    async function saveTaskDetails() {
        // Create a mutable copy of the current task list data from the store
        const tempTaskListData = { ...taskListData };
        let taskToSave: taskListDataType = {}; // Initialize an empty object for the task being saved/updated

        // --- Form Validation ---
        // Validate task title (remove extra spaces and check if empty)
        if (regex.seRMV(taskTitle) === "") {
            setToast({ show: true, msg: str.TASK_TITLE_REQUIRED });
            return; // Stop execution if validation fails
        }
        // Validate due date
        if (!dueDate) {
            setToast({ show: true, msg: str.DUE_DATE_REQUIRED });
            return; // Stop execution if validation fails
        }

        // --- Task Creation/Update Logic ---
        if (_edit) {
            // If in edit mode, retrieve the existing task item by its ID
            if (_item?.id) {
                taskToSave = tempTaskListData[_item.id] || {}; // Use existing item or empty object if not found
            }

            // Update properties of the existing task
            taskToSave.title = taskTitle;
            taskToSave.description = desc;
            taskToSave.completed = completed;
            if (dueDate) taskToSave.dueDate = dueDate.toLocaleDateString(); // Store date as ISO string for consistency and persistence
            // Note: If _item.id is undefined here, it means the _item was not found in taskListData,
            // which might indicate a data inconsistency. The current logic handles this by using an empty object.
            if (_item?.id) {
                tempTaskListData[_item.id] = taskToSave; // Update the task in the temporary list
            }
        } else {
            // If in create mode, generate a unique ID for the new task
            const newID = generateUniqueID();
            // Create a new task object
            taskToSave = {
                userId: 1, // Assuming a default user ID for new tasks
                id: newID,
                title: taskTitle,
                description: desc,
                dueDate: dueDate ? dueDate.toISOString() : new Date().toISOString(), // Ensure dueDate is always set and in ISO format
                completed: completed,
            };
            tempTaskListData[newID] = taskToSave; // Add the new task to the temporary list
        }

        // Update the Zustand store with the modified task list
        setResetTaskListData(tempTaskListData);
        // Navigate back to the previous screen (e.g., task list)
        navigation.goBack();
    }

    return (
        <MasterView
            title={_edit ? str.UPDATE_TASK : str?.CREATE_NEW_TASK} // Dynamic title based on mode
            style={{ padding: bSpace }} // Apply padding to the MasterView content
            // Modals prop for MasterView to render DatePicker outside the main content flow
            modals={
                <>
                    <DatePicker
                        modal // Render as a modal
                        mode='date' // Date selection mode
                        open={isDatePickerVisible} // Control modal visibility
                        date={dueDate || new Date()} // Default date for the picker (current date if dueDate is null)
                        onCancel={() => { setIsDatePickerVisible(false); }} // Hide modal on cancel
                        onConfirm={(date: Date) => {
                            setDueDate(date); // Set the selected date
                            setIsDatePickerVisible(false); // Hide modal on confirm
                        }}
                    />
                </>
            }
        >
            {/* Task Title Input */}
            <TextInputX
                phNm={str.TASK_TITLE} // Placeholder text
                text={taskTitle} // Current value
                onChangeT={setTaskTitle} // Handler for text changes
                kbType='default' // Keyboard type
                rKeyType='next' // Return key type to move to next input
                onSubEdit={() => descRef.current?.focus()} // Focus description input on submit
            />
            {/* Description Input */}
            <TextInputX
                reff={descRef} // Ref to control focus
                phNm={str.DESCRIPTION} // Placeholder text
                text={desc} // Current value
                onChangeT={setDesc} // Handler for text changes
                kbType='default' // Keyboard type
                rKeyType='default' // Return key type
                mSty={{ maxHeight: undefined, height: undefined }} // Override default max height
                inputSty={{ height: _HEIGHT * .3 }} // Set specific height for multiline input
                multiline // Enable multiline input
            />
            {/* Due Date Input (read-only, opens DatePicker on press) */}
            <TextInputX
                readOnly // Make input read-only
                onPressIn={() => { setIsDatePickerVisible(true); }} // Open date picker on press
                phNm={str.DUE_DATE} // Placeholder text
                text={dueDate?.toLocaleDateString()} // Display formatted date
            />
            {/* Completed Status Switch */}
            <View style={{
                flexDirection: 'row',
                marginBottom: bSpace / 2,
                justifyContent: 'space-between',
            }} >
                <TextX
                    text={str.COMPLETED} // Label for the switch
                    fFamily={font.MEDIUM} // Font family
                    fSize={Size(15)} // Font size
                />
                <SwitchX
                    value={completed} // Current switch value
                    size={30} // Size of the switch
                    onValueChange={() => setCompleted(!completed)} // Toggle completed status
                    bgCol={[col.WHITE, col.PRIMARY]} // Background colors for off/on states
                    col={[col.PRIMARY, col.WHITE]} // Thumb colors for off/on states
                />
            </View>
            {/* Save Button */}
            <ButtonX
                text={str.SAVE} // Button text
                mSty={{ flex: undefined }} // Override default flex behavior
                onPress={saveTaskDetails} // Handler for button press
            />
        </MasterView>
    );
};

export default AddEditTaskController;

/**
 * @description `styFN` is a function that returns a StyleSheet object.
 * It's defined outside the component to prevent re-creation on every render,
 * improving performance. It takes theme properties to create dynamic styles.
 *
 * @param {defStyObjType} defStyObj - Object containing default style properties from the theme.
 * @returns {object} A StyleSheet object containing various styles for the component.
 */
const styFN = ({ font, col, bottom }: defStyObjType) => StyleSheet.create({
    // No specific styles defined here yet, but this is where they would go.
    // Example:
    // container: {
    //     flex: 1,
    //     padding: bSpace,
    // },
});
