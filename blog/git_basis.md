一，选择题

  1. 如果提示提交内容为空、不能提交，则最为合适的处理方式是：2

    1. 执行 git status 查看状态，再执行 git add 命令选择要提交的文件，然后提交。

    2. 执行 git commit --allow-empty ，允许空提交。

    3. 执行 git commit -a ，提交所有改动。

    4. 执行 git commit --amend 进行修补提交。

 

  2. 如果刚刚完成的提交说明写错了，应该如何操作？ 4

    1. 执行 git commit -m "message..." 重写提交说明。

    2. 执行 git reset --hard HEAD^ ，丢弃最新提交。

    3. 执行 git revert HEAD 反转最新提交。

    4. 执行 git commit --amend 进行修补提交。

 

  3. 如果项目中文件 Hello.js 被不小心从工作区删除了，下面哪个命令可以找回该文件？ 3

    1. git revert Hello.js

    2. git update Hello.js

    3. git checkout HEAD -- Hello.js

    4. git reset -- Hello.js

 

  4. 修补提交导致之前提交中的文件 addressbook.txt 的重要数据丢失，能找回么？什么方法最好？ 4

    1. 不能找回，因为提交丢失了。

    2. 能找回。用 git checkout HEAD@{1} -- addressbook.txt 命令。

    3. 能找回。用 git fsck 找到处于悬空状态的对象，其中一个就是 addressbook.txt 文件。

    4. 能找回。用 git checkout HEAD^ -- addressbook.txt 命令。

 

  5. 向版本库中添加一个 .gitignore 文件，其中包含 *.txt 的内容。若版本库中已有文件 README.txt 。则下列说法正确的是：

    1. 文件 README.txt 被删除。

    2. 文件 README.txt 不受忽略文件 .gitignore 的影响，修改状态会被追踪。

    3. 文件 README.txt 会显示合并冲突。

    4. 对文件 README.txt 的任何更改将被忽略。

 

  6. 项目跨平台会因为文件名是否区分大小写，导致文件冲突。下面说法正确的是： 3

    1. 在大小写敏感的Linux系统上设置配置变量 core.ignorecase 值为 true 。

    2. 在大小写不敏感的Linux系统上设置配置变量 core.ignorecase 值为 false 。

    3. 在大小写不敏感的Windows系统上设置配置变量 core.ignorecase 值为 true 。

    4. 在大小写不敏感的Windows系统上设置配置变量 core.ignorecase 值为 false 。

 

  7. 如果把项目中文件 hello.js 的内容破坏了，如何使其还原至原始版本？ 2

    1. git reset -- hello.js

    2. git checkout HEAD -- hello.js

    3. git revert hello.js

    4. git update hello.js

    

  8. 修改的文档 meeting.doc 尚未提交，因为错误地执行了 git reset --hard 导致数据丢失。丢失的数据能找回么？ 

    1. 不能。执行硬重置使工作区文件被覆盖，导致数据丢失无法找回。

    2. 能。可以通过 git checkout HEAD@{1} -- meeting.doc 找回。

    3. 不确定。如果在重置前执行了 git add 命令将 meeting.doc 加入了暂存区，则可以在对象库中处于悬空状态的文件中找到。

    4. 不能。因为未提交所以无法找回。

 

  9. 下面哪一个命令不会改变提交历史？ 2

    1. git reset --hard HEAD~1

    2. git checkout HEAD^^ .

    4. git commit --amend

 

  10. 我使用和其他人不一样的IDE软件，总是在目录下生成以 .xx 为后缀的临时文件。如何避免由于自己的误操作导致此类文件被添加到版本库中呢？ 2

    1. 执行 git clean -f 删除临时性文件。

    2. 向版本库中添加一个 .gitignore 文件，其中包含一条内容为 *.xx 的记录。

    3. 在文件 .git/info/exclude 中添加一条内容为 *.xx 的记录。

    4. 更换另外一款IDE软件。

 

  11. 所有改动的文件都已加入暂存区，若希望将其中的 other.js 文件下次再提交，如何操作？ 4

    1. git reset -- other.js

    2. git checkout -- other.js

    3. git checkout HEAD other.js

    4. git reset --hard -- other.js

 

  12. 关于删除分支 XX ，下列说法正确的是：2

    1. 执行 git push origin :XX 来删除远程版本库的 XX 分支。

    2. 执行 git branch -D XX 删除分支，总是能成功。

    3. 远程版本库删除的分支，在执行 git fetch 时本地分支自动删除。

    4. 本地删除的分支，执行 git push 时，远程分支亦自动删除。

 

  13. 工作在特性分支，常常因为执行 git push 默认推送所有本地和远程共有分支，导致非当前分支报告 non-fast-forward 错误。如果设置只推送当前分支可避免此类问题。下面操作正确的是：1

    1. git config --global push.default upstream

    2. git config --global pull.rebase true

    3. git config --global receive.denyDeletes true

    4. git config --global pager.status true

 

  14. 关于对象库（.git/objects）说法错误的是：2

    1. 两个内容相同文件名不同的文件，在对象库中仅有一个拷贝。

    2. 对象库执行 git gc 操作后，reflog 会被清空导致其中记录的未跟踪提交及指向的文件被丢弃。

    3. 删除文件后，再通过添加相同文件找回，不会造成版本库的冗余。

    4. 对象库并非一直保持最优存储，而是通过周期性地执行 git gc 优化版本库。

 

  15. 对于命令 git push 的默认行为，说法错误的是：____

    1. 当前分支总是会被推送。

    2. 会推送本地和远程共有的分支。

    3. 若远程版本库为空（刚初始化完毕），不带参数地执行 git push 不会有分支被推送。

    4. 本地创建的里程碑（tag）不会被推送。

 

二、问答

  1、在git里提交一个文件修改的步骤是怎样的？
> * git status 检查出被修改的文件(非必须)
> * git add filename 把被修改的文件提交到暂存区
> * git commit filename -m"message" 提交到版本库里
> * git push [远程仓库名字,默认origin] [远程仓库分支名字，默认master]

  2、git分支切换为什么快?背后的原因是什么？
> git分支的建立基于git的commit结构，每一个commit指向前一个commit，建立分支只是在当前HEAD指向的commit上多一个指向它的commit，所以速度快并且方便。

  3、什么情况下提交会有冲突？冲突如何解决。
> 当没有把一个文件add到暂存区就执行commit提交甚至是push到远程仓库的时候，提交会有冲突。解决方案就是先把文件add到暂存区，然后进行后续操作。

