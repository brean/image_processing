================
image_processing
================

image processing tool with easy-to-use web interface.
Used firstly for game development (grayscale images, create texture atlas) but is extendable for any other type of image processing.

Discription
===========
Python-based image processing tool with easy-to-use web interface. Using `JSPLumb <https://jsplumbtoolkit.com/>`_ you can easily wire folders and functions

Used firstly for game development to create asset pipelines (grayscale images, create texture atlas, copy files, ...) but is extendable for any other type of image processing.

Features
========
- tasks
  - grayscale
  - texture atlas (using `txtrpacker <https://github.com/brean/txtrpacker>`)
- web ui to connect tasks
- Python based task (and dependency) management

ToDo / wishlist
===============
- video how to install & use it
- developer documentation
- unit tests
- create `celery <http://www.celeryproject.org/>` tasks
- more tasks
  - merge with background
  - slice image into tiles (so the parts can be used in a texture atlas)
  - write text
  - scale/resize (create thumbnails)
  - image filter from PIL (sharpen, smoth, find_edges, blur, ...)
  - image analysis (Hough Line Transform, Histogram, ...)
  - ...?

Note
====

This project has been set up using PyScaffold 2.2.1. For details and usage
information on PyScaffold see http://pyscaffold.readthedocs.org/.
