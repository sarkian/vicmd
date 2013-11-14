# coding: utf-8
# Last Change: 2013 Nov 14, 17:22

import os

from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *


dirname = u'/root'
try:
    files = os.listdir(dirname)
    files.sort()
    for fname in files:
        if os.path.isdir(os.path.join(dirname, fname)):
            #print type(fname)
            print fname.encode('utf-8')
            #print type(fname.encode('utf-8'))
except OSError, e:
    print e.strerror
    pass

#print type(u'щлф')
