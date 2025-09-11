import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { generateGameCharacter, GameCharacter } from '../data/characterMapping';
import * as Icons from 'lucide-react';

interface GameCharacterDisplayProps {
  upperTrigram: string;
  lowerTrigram: string;
  className?: string;
}

const GameCharacterDisplay: React.FC<GameCharacterDisplayProps> = ({
  upperTrigram,
  lowerTrigram,
  className = ''
}) => {
  const { t } = useLanguage();
  
  let character: GameCharacter;
  try {
    character = generateGameCharacter(upperTrigram, lowerTrigram);
  } catch (error) {
    console.error('Failed to generate character:', error);
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <p className="text-red-600 text-sm">角色生成失败</p>
      </div>
    );
  }

  // 动态获取图标组件
  const RoleIcon = Icons[character.role.icon as keyof typeof Icons] as React.ComponentType<any>;
  const WeaponIcon = Icons[character.weapon.icon as keyof typeof Icons] as React.ComponentType<any>;

  return (
    <div className={`bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 ${className}`}>
      {/* 标题 */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {t('resultPage.gameCharacter')}
        </h3>
        <p className="text-sm text-slate-600">
          {t('resultPage.characterCombination')}
        </p>
      </div>

      {/* 角色组合展示 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* 武器（上卦） */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-purple-100 mb-3`}>
              {WeaponIcon && (
                <WeaponIcon className={`w-6 h-6 md:w-8 md:h-8 ${character.weapon.color}`} />
              )}
            </div>
            <h4 className="font-semibold text-purple-800 mb-1">
              {t('resultPage.characterWeapon')}
            </h4>
            <p className="text-lg font-bold text-slate-900 mb-2">
              {character.weapon.name_zh}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {character.weapon.description_zh}
            </p>
            <div className="mt-2 text-xs text-purple-600">
              {t('resultPage.weaponFromOuterBehavior')}
            </div>
          </div>
        </div>

        {/* 职业（下卦） */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-100 mb-3`}>
              {RoleIcon && (
                <RoleIcon className={`w-6 h-6 md:w-8 md:h-8 ${character.role.color}`} />
              )}
            </div>
            <h4 className="font-semibold text-blue-800 mb-1">
              {t('resultPage.characterRole')}
            </h4>
            <p className="text-lg font-bold text-slate-900 mb-2">
              {character.role.name_zh}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {character.role.description_zh}
            </p>
            <div className="mt-2 text-xs text-blue-600">
              {t('resultPage.roleFromInnerMotivation')}
            </div>
          </div>
        </div>
      </div>

      {/* 组合角色 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-slate-200">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-purple-200">
              {WeaponIcon && (
                <WeaponIcon className={`w-5 h-5 md:w-6 md:h-6 ${character.weapon.color}`} />
              )}
            </div>
            <div className="text-xl md:text-2xl font-bold text-slate-400">+</div>
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-200">
              {RoleIcon && (
                <RoleIcon className={`w-5 h-5 md:w-6 md:h-6 ${character.role.color}`} />
              )}
            </div>
          </div>
          
          <h4 className="text-lg font-bold text-slate-900 mb-2">
            {character.combinedName_zh}
          </h4>
          
          <p className="text-sm text-slate-700 leading-relaxed mb-4">
            {character.combinedDescription_zh}
          </p>

          {/* 应用场景 */}
          <div className="border-t border-slate-200 pt-3">
            <h5 className="text-sm font-semibold text-slate-800 mb-2">
              {t('resultPage.characterApplications')}
            </h5>
            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                {t('resultPage.gameDesign')}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {t('resultPage.characterCreation')}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                {t('resultPage.teamBuilding')}
              </span>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                {t('resultPage.personalityVisualization')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCharacterDisplay;