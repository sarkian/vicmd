# coding: utf-8
# Last Change: 2013 Nov 17, 20:26

if False:
    import PyQt4.QtGui
    from window import Window
    from view import View
    from resourcemanager import ResourceManager
    from backend import Backend


#class App(object):
    #def __init__(self):
        #App.app = PyQt4.QtGui.QApplication()
        #self.window = Window()
        #self.backend = Backend()
        #self.view = View()
        #self.resman = ResourceManager()
        #self.backend = Backend()


if False:
    class App(object):
        app = PyQt4.QtGui.QApplication
        window = Window
        view = View
        resman = ResourceManager
        backend = Backend
else:
    class App(object):
        pass




