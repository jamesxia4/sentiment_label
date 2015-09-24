# -*- coding: cp936 -*-
import random
stat=[]
for i in range(1,201):
    f1=float(random.randint(-1,1))
    print "Insert into label_ods_rst values(%d,20150923,1,1,1,1,1,'百度贴吧','画面','这个游戏画面真糟','这个游戏画面真糟，但是还是挺好玩的',%f,0,1,5,'James');"%(i,f1)

    f2=float(random.randint(-1,1))
    print "Insert into label_ods_rst values(%d,20150923,1,1,1,1,1,'百度贴吧','画面','这个游戏画面真糟','这个游戏画面真糟，但是还是挺好玩的',%f,0,1,5,'John');"%(i,f2)

    f3=float(random.randint(-1,1))
    print "Insert into label_ods_rst values(%d,20150923,1,1,1,1,1,'百度贴吧','画面','这个游戏画面真糟','这个游戏画面真糟，但是还是挺好玩的',%f,0,1,5,'Mary');"%(i,f3)
    stat.append((f1,f2,f3))
	
for i in range(200):
    countPos=0
    countNeu=0
    countNeg=0
    for j in range(3):
        if  stat[i][j]>0.0:
            countPos+=1
        elif stat[i][j]==0.0:
            countNeu+=1
        else:
            countNeg+=1

    print countPos, countNeu, countNeg
	
	
