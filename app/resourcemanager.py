# coding: utf-8
# Last Change: 2013 Nov 11, 14:13

from PyQt4.QtCore import *
from PyQt4.QtGui import *
from PyQt4.QtWebKit import *


class ResourceManager(QObject):
    
    def __init__(self, root):
        QObject.__init__(self)
        self.root = root

    @pyqtSlot(str, result=str)
    def getStyle(self, name):
        return 'file://%s/css/%s.css' % (self.root, name)

    @pyqtSlot(str, result=str)
    def getScript(self, name):
        return 'file://%s/js/%s.js' % (self.root, name)

    def render(self, view_name, view_vars={}):
        contents = open('%s/views/%s.html' % (self.root, view_name)).read()
        for varname in view_vars:
            contents = contents.replace('${%s}' % varname, view_vars[varname])
        return contents
    
