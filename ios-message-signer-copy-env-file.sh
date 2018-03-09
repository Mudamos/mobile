# This file is used in a run script on the ios message action signer
# Here is a copy of the Build phase

file=.env.myenv

echo "Picking env file $file"

echo "Current folder: $(pwd)"

target="$CONFIGURATION_BUILD_DIR/$UNLOCALIZED_RESOURCES_FOLDER_PATH/envfile"

echo "Will copy to $target"

cp "../$file" "$target"

echo "Done! :)"
