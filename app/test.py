#!/usr/bin/env python
# coding: utf-8
# Last Change: 2013 Nov 18, 12:16

import os
import argparse
import json

from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *


a = {'a': 1}
b = a or {}
print b
