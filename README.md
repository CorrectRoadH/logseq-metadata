# Logseq Metadata

A Logseq plugin for searching and inserting metadata for movies, books, and music from NeeoDB.

## Features

### 1. Insert Media Metadata
Search and insert metadata for movies, books, and music directly into Logseq.

<video controls width="100%">
  <source src="https://github.com/user-attachments/assets/d306957d-6888-475e-8092-8f8aaaca4011" type="video/mp4">
  Your browser does not support the video tag.
</video>

### 2. Custom Template
Customize the metadata template to fit your workflow.

![Template Settings](https://github.com/user-attachments/assets/16b32f29-20b7-4908-a366-e01240647a87)

## Usage

1. Type `/metadata` in Logseq editor
2. Search for your desired media (book, movie, music, or TV show)
3. Click "Insert" to add the metadata to your page

## Installation

### From Marketplace
1. Open Logseq
2. Go to Plugins (top right toolbar)
3. Search for "Logseq Metadata"
4. Click Install

### Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/ctrdh/logseq-metadata/releases)
2. Extract the `.zip` file
3. Open Logseq → Plugins → Load unpacked plugin
4. Select the extracted folder

## Configuration

You can customize the metadata template in plugin settings:

**Default template:**
```
type:: $TYPE
cover:: $COVER
author:: $AUTHOR
actor:: $ACTOR
year:: $YEAR
tags::
```

**Available placeholders:**
- `$TYPE` - Media type (book, movie, music, tv)
- `$COVER` - Cover image URL
- `$AUTHOR` - Author names (for books)
- `$ACTOR` - Actor names (for movies/TV)
- `$YEAR` - Publication/Release year
