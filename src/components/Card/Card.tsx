import React, { useEffect } from 'react';
import styled from 'styled-components';
import { waterNeed, isTreeAdopted } from '../../utils';
import { useStoreState } from '../../state/unistore-hooks';
import { useAuth0 } from '../../utils/auth/auth0';
import store from '../../state/Store';

import CardWrapper from './CardWrapper';
import CardProperty from './CardProperty';
import CardAccordion from './CardAccordion';
import CardHeadline from './CardHeadline';
import CardDescription from './CardDescription';
import CardAccordionTitle from './CardAccordion/CardAccordionTitle';
import TreeType from './CardAccordion/TreeType';
import TreeWatering from './CardAccordion/TreeWatering';
import TreeLastWatered from './CardAccordion/TreeLastWatered';
import ButtonWater from '../ButtonWater';
import CardWaterDrops from './CardWaterDrops';
import ButtonAdopted from '../ButtonAdopted';

import content from '../../assets/content';
import { IsTreeAdoptedProps, Generic, Tree } from '../../common/interfaces';
import Icon from '../Icons';
import StackedBarChart from '../StackedBarChart';
const { sidebar } = content;
const { treetypes, watering } = sidebar;

type FetchDataOpts = Omit<IsTreeAdoptedProps, 'token'>;

const FlexColumnDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CaretakerDiv = styled.div`
  padding-bottom: 0.75rem;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  line-height: ${p =>
    parseFloat(p.theme.fontSizeM.replace('rem', '')) * 1.2}rem;
`;

const CaretakerSublineSpan = styled.span`
  font-size: ${p => p.theme.fontSizeM};
  margin-top: -${p => parseFloat(p.theme.fontSizeM.replace('rem', '')) / 2 + 0.1}rem;
  margin-left: -${p => p.theme.fontSizeM};
`;
const SublineSpan = styled.span`
  margin-bottom: 0.75rem;
  text-transform: capitalize;
`;

const RainContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${p => p.theme.spacingM};
  border-bottom: 1px solid ${p => p.theme.colorGreyLight};
`;

const TreeTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-top: 0px;
  line-height: 125%;
  margin-bottom: 5px;
`;

const Card: React.FC<{ data: Tree }> = ({ data }) => {
  const { treeLastWatered } = useStoreState('treeLastWatered');

  const { treeAdopted } = useStoreState('treeAdopted');

  const { user } = useStoreState('user');

  const { selectedTree } = useStoreState('selectedTree');

  const { getTokenSilently, isAuthenticated } = useAuth0();

  const { standalter, artdtsch, gattungdeutsch, caretaker } = data;

  const getTreeProp = (p: Generic | string | null) => {
    return p === 'null' || p === undefined ? null : p;
  };

  const fetchData: (opts: FetchDataOpts) => Promise<void> = async ({
    id,
    uuid,
    store,
    isAuthenticated,
  }) => {
    try {
      if (user && selectedTree) {
        const token = await getTokenSilently();
        await isTreeAdopted({
          id,
          uuid,
          token,
          isAuthenticated,
          store,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (!selectedTree) return;
    fetchData({
      id: selectedTree.id,
      uuid: user.user_id,
      store,
      isAuthenticated,
    }).catch(console.error);
  }, [user, selectedTree, treeAdopted]);

  const treeType = treetypes.find(treetype => treetype.id === gattungdeutsch);

  return (
    <CardWrapper>
      <FlexColumnDiv>
        <TreeTitle>{artdtsch}</TreeTitle>
        {!treeType &&
          treeType !== 'undefined' &&
          gattungdeutsch !== null &&
          gattungdeutsch !== 'undefined' &&
          gattungdeutsch !== undefined && (
            <SublineSpan>
              {getTreeProp(gattungdeutsch.toLowerCase())}
            </SublineSpan>
          )}
        {caretaker && caretaker.length > 0 && (
          <CaretakerDiv>
            <Icon iconType='water' height={32}></Icon>
            <CaretakerSublineSpan>{`Dieser Baum wird regelmäßig vom ${caretaker} gewässert.`}</CaretakerSublineSpan>
          </CaretakerDiv>
        )}
        {treeAdopted && <ButtonAdopted />}
        {treeType && treeType.title !== null && (
          <CardAccordion
            title={
              <CardAccordionTitle>
                {getTreeProp(treeType.title)}
              </CardAccordionTitle>
            }
          >
            <TreeType>{treeType.description}</TreeType>
          </CardAccordion>
        )}
        {standalter && standalter !== 'undefined' && (
          <CardProperty name='Standalter' value={standalter + ' Jahre'} />
        )}
        {standalter !== 'null' && standalter !== 'undefined' && (
          <CardAccordion
            title={
              <CardAccordionTitle>
                Wasserbedarf:
                {standalter && (
                  <CardWaterDrops data={waterNeed(parseInt(standalter))} />
                )}
              </CardAccordionTitle>
            }
          >
            <TreeWatering data={watering} />
          </CardAccordion>
        )}
        <RainContainer>
          <CardHeadline>Wassermenge</CardHeadline>
          <CardDescription>der letzten 30 Tage</CardDescription>
          <StackedBarChart />
        </RainContainer>
        {Array.isArray(treeLastWatered) && treeLastWatered.length > 0 && (
          <CardAccordion
            active={true}
            title={<CardAccordionTitle>Zuletzt gegossen</CardAccordionTitle>}
          >
            <TreeLastWatered data={treeLastWatered} />
          </CardAccordion>
        )}
        <ButtonWater />
      </FlexColumnDiv>
    </CardWrapper>
  );
};

export default Card;
