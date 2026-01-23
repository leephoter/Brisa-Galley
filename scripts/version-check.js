#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const currentVersion = packageJson.version;

// Parse current version
const [currentMajor, currentMinor, currentPatch] = currentVersion.split('.').map(Number);

async function main() {
  // Dynamic import for ES modules
  const inquirer = (await import('inquirer')).default;

  // Build 실행 함수
  function runBuild() {
    console.log('\n🚀 빌드를 시작합니다...\n');

    try {
      execSync('next build --webpack', {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
      });

      console.log('\n✅ 빌드 성공!\n');
      return true;
    } catch (error) {
      console.error('\n❌ 빌드 실패!\n');
      process.exit(1);
    }
  }

  console.log(`\n ✨✨✨ BUILD ✨✨✨ \n`);

  // First check: 버전을 올릴지 확인
  const { updateInput } = await inquirer.prompt([
    {
      type: 'input',
      name: 'updateInput',
      message: `빌드 시 버전을 올리시겠습니까? (${currentVersion})`,
      default: 'Y',
    },
  ]);

  const shouldUpdate = updateInput.trim().toLowerCase() === 'y';
  /** updateInput
   * "Y", "y" 입력 → 버전 업데이트 프롬프트 진행
   * 그 외 → 현재 버전 유지하고 바로 빌드
   */

  if (!shouldUpdate) {
    // 버전 유지하고 바로 빌드
    console.log('\n✅ 현재 버전 유지\n');
    runBuild();
    return;
  }

  // Second check: 메이저.마이너 버전
  const { majorMinor } = await inquirer.prompt([
    {
      type: 'input',
      name: 'majorMinor',
      message: `버전을 입력하세요 ${currentMajor}.${currentMinor}`,
      default: `${currentMajor}.${currentMinor}`,
    },
  ]);

  let newMajor = currentMajor;
  let newMinor = currentMinor;

  // "숫자.숫자" 형태인지 검증
  const versionPattern = /^\d+\.\d+$/;
  if (versionPattern.test(majorMinor.trim())) {
    const parts = majorMinor.split('.');
    newMajor = parseInt(parts[0]);
    newMinor = parseInt(parts[1]);
  } else {
    console.log(`⚠️⚠️⚠️ Type Error ⚠️⚠️⚠️`);
    console.log(`기존 버전 유지 ${currentMajor}.${currentMinor}`);
  }

  // Third check: 패치 버전
  const { patch } = await inquirer.prompt([
    {
      type: 'input',
      name: 'patch',
      message: '패치 버전을 입력하세요:',
      default: currentPatch.toString(),
    },
  ]);

  const newPatch = parseInt(patch) || currentPatch;
  const newVersion = `${newMajor}.${newMinor}.${newPatch}`;

  console.log(`\n📦 새 버전: ${currentVersion} → ${newVersion}`);

  // Final confirmation
  const { confirm } = await inquirer.prompt([
    {
      type: 'input',
      name: 'confirm',
      message: '이 버전으로 업데이트하시겠습니까?',
      default: 'Y',
    },
  ]);
  const c = confirm.trim().toLowerCase() === 'y';

  if (!c) {
    // 버전 업데이트 취소하고 현재 버전으로 빌드
    console.log('\n❌ 버전 업데이트 취소\n');
    console.log(`✅ 현재 버전 유지: ${currentVersion}\n`);
    runBuild();
    return;
  }

  // 빌드 실행
  const buildSuccess = runBuild();

  // 빌드 성공 시에만 package.json 업데이트
  if (buildSuccess) {
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`✅ package.json 버전이 ${newVersion}으로 업데이트되었습니다.\n`);
  }
}

main().catch((error) => {
  console.error('Error:', error);
  console.error('\n ❌❌❌ 빌드 실패 ❌❌❌ \n');
  process.exit(1);
});
