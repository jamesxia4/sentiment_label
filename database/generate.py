# -*- coding: utf-8 -*-
import random
stat=[]
# for i in range(1,201):
    # f1=float(random.randint(-1,1))
    # print "Insert into label_ods_rst values(%d,20150923,1,1,1,1,1,'百度贴吧','画面','这个游戏画面真糟','这个游戏画面真糟，但是还是挺好玩的',%f,0,1,5,'James');"%(i,f1)

    # f2=float(random.randint(-1,1))
    # print "Insert into label_ods_rst values(%d,20150923,1,1,1,1,1,'百度贴吧','画面','这个游戏画面真糟','这个游戏画面真糟，但是还是挺好玩的',%f,0,1,5,'John');"%(i,f2)

    # f3=float(random.randint(-1,1))
    # print "Insert into label_ods_rst values(%d,20150923,1,1,1,1,1,'百度贴吧','画面','这个游戏画面真糟','这个游戏画面真糟，但是还是挺好玩的',%f,0,1,5,'Mary');"%(i,f3)
    # stat.append((f1,f2,f3))
	
	
# for i in range(1,101):
#     f1=float(random.randint(-1,1))
#     comment="'现在活跃人数确实少了现在活跃人数确实少了现在活跃人数确实少了现在活跃人数确实少了现在活跃人数确实少了"+str(i)+"'"
#     src="'活跃人数实在太少夜里星星妖王都没人杀可把我一个人累坏了做完不知道哪个小号猛放妖王让我一个人足足杀了一个半小时现在活跃人数确实少了，五灵也抢不到想要的碎片，六万擂台白天都没什么人，这样冷清让耐不住寂寞的人怎么办，希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区3希望白鹤区早日合区"+str(i)+"'"
#     print "Insert into label_ods_src values(%d,1,1,%s,%s,'画面','百度贴吧','http://www.bilibili.com');"%(i,comment,src)

for i in range(1,101):
    sentiment=random.randint(1,4)
    # irrelevent=random.randint(0,1)
    print "Update label_ods_rst set sentiment=%d, is_irrelevent=%d where ods_sentence_id=%d and task_id=%d and task_group=%d and user_id='%s';"%(sentiment,0,i,1,1,"hzzhangtengji")
	
# for i in range(200):
    # countPos=0
    # countNeu=0
    # countNeg=0
    # for j in range(3):
        # if  stat[i][j]>0.0:
            # countPos+=1
        # elif stat[i][j]==0.0:
            # countNeu+=1
        # else:
            # countNeg+=1

    # print countPos, countNeu, countNeg
	
	
