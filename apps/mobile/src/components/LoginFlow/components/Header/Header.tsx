import styled from '@emotion/native'
import Image from '../../../Image'
import backButtonSvg from './img/backButtonSvg'
import {useAtomValue} from 'jotai'
import headerStateAtom from '../../state/headerStateAtom'
import {useNavigation} from '@react-navigation/native'

const RootContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 8px;
  align-items: center;
`

const BackButton = styled.TouchableOpacity``
const BackButtonFiller = styled.View`
  width: 40px;
  height: 40px;
`
const BackImage = styled(Image)`
  width: 40px;
  height: 40px;
`
const ProgressContainer = styled.View`
  flex-direction: row;
`
const ProgressBar = styled.View<{highlighted: boolean}>`
  background-color: ${(p) => (p.highlighted ? '#FFFFFF' : '#4C4C4C')};
  width: 24px;
  height: 4px;
  border-radius: 1px;
`
const ProgressBarSpacer = styled.View`
  width: 4px;
`

function Header(): JSX.Element | null {
  const navigation = useNavigation()
  const headerOptions = useAtomValue(headerStateAtom)

  if (!headerOptions) return null

  return (
    <RootContainer>
      {headerOptions.showBackButton && navigation.canGoBack() ? (
        <BackButton
          onPress={() => {
            if (navigation.canGoBack()) navigation.goBack()
          }}
        >
          <BackImage source={backButtonSvg} />
        </BackButton>
      ) : (
        <BackButtonFiller />
      )}
      <ProgressContainer>
        <ProgressBar highlighted={(headerOptions.progressNumber ?? 0) >= 1} />
        <ProgressBarSpacer />
        <ProgressBar highlighted={(headerOptions.progressNumber ?? 0) >= 2} />
        <ProgressBarSpacer />
        <ProgressBar highlighted={(headerOptions.progressNumber ?? 0) >= 3} />
      </ProgressContainer>
    </RootContainer>
  )
}

export default Header
