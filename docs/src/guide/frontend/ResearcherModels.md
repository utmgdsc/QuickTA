# ResearcherModels

## Introduction

Only admin users have access to ```ResearcheModels```. When running, ```ResearcherModels``` can be accessed via ```http://localhost:8000/ResearcherModels```, or any equivalent URL followed by ```/ResearcherModels```.

```ResearcherModels``` allows the user to select and edit the AI model used within a specified course. 


## ModelHeader

Header for ```ResearcherModels```. Displays the currently selected course's name.

Takes the following properties:
| Properties    | Type   | Description                  |
| ----------    | -------| ---------------------------- |
| courseCode    | str    | Code of the current course   |
| courseName    | str    | Name of the current course   |


## ModelBody
Body for ```ResearcherModels```. Displays and allows editing of model information.

Takes the following properties:
| Properties    | Type   | Description                  |
| ----------- | ------------- | ---------------------------- |
| courseID    | str           | Unique course ID   |
| setLoadingModel | function  | Whether QuickTA is checking for models  |
| loadingModel | callback     | Whether models are loading       |

## ModelCard
Container for models. When selected, opens a modal to edit model information. 

Takes the following properties:
| Properties    | Type   | Description                  |
| ----------- | ------------- | ---------------------------- |
| modelName       | str           | Name of the model |
| colorScheme     | str           | Color scheme of model  |
| modelID         | str           | Unique model ID |
| modelStatus     | bool          | Current status of model|
| setCurrentModel | function      | Function to set the current model   |
| setEnabling     | function      | Function to set enabling status |
| enabling        | bool          | Whether buttons can be pressed   |

## ModelCreator
Opens a modal to create a new model given specific parameters.

Takes the following properties:
| Properties    | Type   | Description                  |
| ----------- | ------------- | ----------------------------- |
| creating     | bool         | Whether buttons can be pressed  |
| setCreating  | function     | Function to set creating status |
| courseID    | str           | Unique course ID   |

## ModelRemover
Opens a model to remove a specified model

Takes the following properties:
| Properties    | Type   | Description                  |
| ----------- | ------------- | -----------------------------  |
| courseID    | str           | Unique course ID   |
| deleting    | bool          | Whether buttons can be pressed |
| setDeleting | function      | Function to set deleting status |
| allModels   | list          | List of Model objects    |