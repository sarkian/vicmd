#!/usr/bin/env python
# coding: utf-8
# Last Change: 2013 Nov 20, 21:40

import os
import argparse
import json

from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *


strdata = '{"some": false}'
data = json.loads(strdata)
print '%s' % data['some']
