'use strict';

import inquirer from 'inquirer';

const  prompter = (cz, commit) =>  {
    // 提问列表
    inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: '选择你的提交类型:',
        choices: [
          { name: '特性: 一个新的特性', value: 'feat' },
          { name: '修复: 修复一个Bug', value: 'fix' },
          { name: '文档: 变更的只有文档', value: 'docs' },
          { name: '样式: 不影响代码含义的变化 (空格, 格式化, 缺少分号等)', value: 'style' },
          { name: '重构: 既不修复bug也不添加特性的代码变动', value: 'refactor' },
          { name: '性能: 提高性能的代码变动', value: 'perf' },
          { name: '测试: 添加缺失的测试或更正现有的测试', value: 'test' },
          { name: '构建: 影响构建系统或外部依赖关系的更改', value: 'build' },
          { name: 'CI: 对CI配置文件和脚本的更改', value: 'ci' },
          { name: '回退: 回退错误或测试代码', value: 'revert' },
          { name: '版本: 仅仅是修改版本号', value: 'version' },
          { name: '杂项: 其他不修改源文件或测试文件的更改', value: 'chore' }
        ],
      },
      {
        type: 'input',
        name: 'scope',
        message: '这个变更的范围是什么？(例如组件或文件的名称，如果不适用则留空):',
        when: answers => answers.type !== 'version', // 当选择修改版本号时不询问此问题
      },
      {
        type: 'input',
        name: 'subject',
        message: '写一个简短精炼的变更描述:',
        when: answers => answers.type !== 'version', // 当选择修改版本号时不询问此问题
      },
      {
        type: 'input',
        name: 'body',
        message: '提供一个更详细的变更描述 (如果不适用则留空):',
        when: answers => answers.type !== 'version', // 当选择修改版本号时不询问此问题
      },
      {
        type: 'input',
        name: 'breaking',
        message: '列出任何BREAKING CHANGES (如果没有留空):',
        when: answers => answers.type !== 'version', // 当选择修改版本号时不询问此问题
      },
      {
        type: 'input',
        name: 'issues',
        message: '提到相关的issue (例如: "fix #123", "re #123". 如果没有留空):',
        when: answers => answers.type !== 'version', // 当选择修改版本号时不询问此问题
      }
    ]).then((answers) => {
      // 当选择"版本"时，生成一个特殊的提交信息
      if (answers.type === 'version') {
        return commit('chore(release): bump version');
      }

      // 格式化提交信息
      const scope = answers.scope ? `(${answers.scope})` : '';
      const breakingChange = answers.breaking ? `\n\nBREAKING CHANGE: ${answers.breaking}` : '';
      const issues = answers.issues ? `\n\nCloses ${answers.issues}` : '';
      const commitMessage = `${answers.type}${scope}: ${answers.subject}\n\n${answers.body}${breakingChange}${issues}`;
      
      // 调用 commit 函数完成提交
      commit(commitMessage);
    });
  };
// 使用 export 语法导出 prompter 函数
export { prompter };