# coding: utf-8
# Last Change: 2013 Nov 11, 20:03

from app import App


class ScriptManager(object):

    def __init__(self):
        self.scriptnames = []
        self.stylenames = []
        self.scripts = []
        self.styles = []

    def addScript(self, name):
        if not name in self.scriptnames:
            self.scripts.append(App.resman.getScript(name))
            self.scriptnames.append(name)

    def addStyle(self, name):
        if not name in self.stylenames:
            self.styles.append(App.resman.getStyle(name))
            self.stylenames.append(name)

    def render(self, indent=0):
        indent_str = ' ' * indent
        html = []
        for style in self.styles:
            html.append(
                indent_str +
                    ('<link rel="stylesheet" type="text/css" href="%s" />' % style))
        for script in self.scripts:
            html.append(
                indent_str +
                    ('<script type="text/javascript" src="%s"></script>' % script))
        return '\n'.join(html)


