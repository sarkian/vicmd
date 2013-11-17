#!/usr/bin/env python
# coding: utf-8
# Last Change: 2013 Nov 17, 15:19

import argparse

from app.vicmd import ViCmd

ap = argparse.ArgumentParser()
ap.add_argument('--dbg', action='store_true', help='debug mode')
args = ap.parse_args()

ViCmd(args.dbg).run()

