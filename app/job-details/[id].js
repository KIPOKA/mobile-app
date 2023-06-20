import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Stack, useRouter, useSearchParams } from 'expo-router'


import { Company, JobAbout, JobFooter, JobTabs, ScreenHeaderBtn, Specifics } from '../../components';
import { icons, COLORS, SIZES } from '../../constants';
import useFetch from '../../hook/useFetch';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { RefreshControl } from 'react-native-gesture-handler';

const tabs =["About", "Qualifications", "Responsabilities"];

const JobDetails = () => {
    const router = useRouter();
    const params =useSearchParams();
    const {data, isLoading, error, refetch }= useFetch('job-details', {
        job_id: params.id
    })

    const [refreshing, setRefreching] =useState(false);
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const onRefresh =useCallback(() =>{ 
                setRefreching(true);
                refetch();
                setRefreching(false);
    }, [])
    const displayTabContent=() =>{
        switch(activeTab){
            case "Qualifications":
                    return <Specifics
                                title="Qualifications"
                                points={data[0].job_highlights?.Qualifications ?? ['N/A']}/>
            break;
            case "About":
                return <JobAbout
                    info={data[0].job_description?.Qualifications ?? "No data provided "}
                />
            break;
            case "Responsabilities":
                return <Specifics
                                title="Responsabilities"
                                points={data[0].job_highlights?.Responsabilities ?? ['N/A']}/>
            break;
            default:
            break;
        }
    }
  return (
    <SafeAreaView style={{flex:1, backgroundColor:COLORS.lightWhite}}>
        <Stack.Screen
                options={
                    {
                        headerStyle:{backgroundColor:COLORS.lightWhite},
                        headerShadowVisible:false,
                        headerBackVisible:false,
                        headerLeft:()=>(
                            <ScreenHeaderBtn
                                    iconUrl={icons.left}
                                    dimension="60%"
                                    handlerPress={() =>router.back()}
                            />
                        ),
                        headerRight:()=>(
                            <ScreenHeaderBtn
                                    iconUrl={icons.share}
                                    dimension="60%"
                                    handlerPress={() =>router.back()}
                            />
                        ),
                        headerTitle:''

                    }
                }    
        />


        <>
        <ScrollView showsHorizontalScrollIndicator={false} refreshControl=
            {<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                    {isLoading?(
                        <ActivityIndicator size ="large" color={COLORS.primary}/>

                    ):error ?(
                        <Text>Something went wrong</Text>
                    ): data.length ===0 ?(
                        <Text>No data</Text>
                    ):(
                        <View style={{padding: SIZES.medium, paddingBottom: 100}}>
                            <Company
                                    companyLogo={data[0].employer_logo}
                                    jobTitle= {data[0].job_title}
                                    companyName={data[0].employer_name}
                                    location ={data[0].job_country}
                            
                            />

                            {/* For the job tab */}
                            <JobTabs
                                tabs={tabs}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}

                            />
                        {displayTabContent()}

                        </View>
                    )
                    }
        </ScrollView>
        <JobFooter url={data[0]?.job_google_link ?? 'https://careers.google.com/jobs/results'}/>

        </>

    </SafeAreaView>
  )
}

export default JobDetails;
 