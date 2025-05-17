import {
  useGetMyServersQuery,
  useLeaveVoiceChannelMutation,
} from '@beep/server'
import { AppDispatch, resetStore } from '@beep/store'
import { useModal } from '@beep/ui'
import { useLogoutMutation } from '@beep/user'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ServersNavigation from '../ui/servers-navigation'

export function ServersNavigationFeature() {
  const { data: servers } = useGetMyServersQuery()
  const { openModal, closeModal } = useModal()
  const dispatch = useDispatch<AppDispatch>()
  const [leaveServer] = useLeaveVoiceChannelMutation()
  const [logout] = useLogoutMutation()
  const onPrivateMessage = () => {
    navigate('/friends')
  }
  const navigate = useNavigate()
  const onLogout = () => {
    leaveServer()
    dispatch({ type: 'CLOSE_WEBRTC' })
    dispatch(resetStore())
    logout()
    
    // POC : Redirect to Keycloak logout URL
    const realm = "beep-realm"
    const keycloakLogoutUrl = `http://localhost:8080/realms/${realm}/protocol/openid-connect/logout`
    window.location.href = keycloakLogoutUrl
    }

  return (
    <ServersNavigation
      servers={servers}
      onLogout={onLogout}
      onPrivateMessage={onPrivateMessage}
      openModal={openModal}
      closeModal={closeModal}
      responsive={
        window.location.pathname.includes('servers') &&
        !window.location.pathname.includes('/servers/discover')
      }
    />
  )
}
