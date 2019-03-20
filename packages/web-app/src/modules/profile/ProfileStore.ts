import { observable, action, flow } from 'mobx'
import { Profile } from './models'
import { Config } from '../../config'
import { RootStore } from '../../Store'

export class ProfileStore {
  @observable
  public currentProfile?: Profile

  @observable
  public isUpdating: boolean = false

  constructor(private readonly store: RootStore) {}

  @action.bound
  loadProfile = flow(function*(this: ProfileStore) {
    console.log('Loading the user profile')

    this.isUpdating = true

    //TODO: Change this to an api call for GET /profile
    yield this.sleep(1000)

    this.currentProfile = {
      id: '1234567',
      username: 'saladchef',
      email: 'dev@salad.io',
      termsOfService: undefined,
      referred: undefined,
      trackUsage: undefined,
      tutorialComplete: false,
    }

    if (this.currentProfile.trackUsage) {
      this.store.analytics.start()
    }

    this.isUpdating = false
  })

  @action.bound
  agreeToTerms = flow(function*(this: ProfileStore) {
    if (this.currentProfile === undefined) return

    console.log('Accepted TOS')

    this.isUpdating = true

    yield this.sleep(1000)

    //TODO: Make this an API call with the terms version, then replace this.profile with the returned profile
    this.currentProfile.termsOfService = Config.termsVersion

    this.isUpdating = false

    this.store.routing.replace('/')
  })

  @action.bound
  setAnalyticsOption = flow(function*(this: ProfileStore, agree: boolean) {
    if (this.currentProfile === undefined) return

    console.log('Updating analytics to ' + agree)

    this.isUpdating = true

    yield this.sleep(1000)

    //TODO: Make this an API call with the new option, then replace this.profile with the returned profile
    this.currentProfile.trackUsage = agree

    if (this.currentProfile.trackUsage) {
      this.store.analytics.start()
    } else if (this.currentProfile.trackUsage === false) {
      this.store.analytics.disable
    }

    this.isUpdating = false

    this.store.routing.replace('/')
  })

  @action.bound
  submitReferralCode = flow(function*(this: ProfileStore, code: string) {
    if (this.currentProfile === undefined) return

    this.isUpdating = true

    yield this.sleep(1000)

    console.log('Sending referral code ' + code)

    this.currentProfile.referred = true

    this.isUpdating = false

    this.store.routing.replace('/')
  })

  @action.bound
  skipReferral = flow(function*(this: ProfileStore) {
    if (this.currentProfile === undefined) return

    console.log('Skipping referral')

    this.isUpdating = true

    yield this.sleep(1000)

    if (this.currentProfile.referred === undefined) {
      //TODO: Make this an API call with the new option, then replace this.profile with the returned profile
      this.currentProfile.referred = false
    }

    this.isUpdating = false

    this.store.routing.replace('/')
  })

  sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}