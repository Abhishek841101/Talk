


import { useCallback, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { OutlineButton, PrimaryButton } from "./Buttons";
import GridItem from "./GridItem";
import FollowersModal from "./FollowesModal";
import PostModal from "./PostModal";
import {
  closeFollowers,
  closeFollowing,
  closePost,
  fetchProfile,
  fetchTabData,
  followOrUnfollow,
  openFollowers,
  openFollowing,
  openPost,
  refreshTabStart,
  setActiveTab,
} from "../../features/profile/profileSlice";

// ---------------- Theme Hook ----------------
const useThemeColors = () => {
  const scheme = useColorScheme?.() || "light";
  const isDark = scheme === "dark";
  return useMemo(
    () => ({
      isDark,
      bg: { primary: isDark ? "#000" : "#fff" },
      text: {
        primary: isDark ? "#fff" : "#111",
        secondary: isDark ? "#c7c7c7" : "#666",
      },
      border: isDark ? "#222" : "#e5e5e5",
      tint: isDark ? "#0a84ff" : "#007aff",
    }),
    [scheme]
  );
};

// ---------------- Utility ----------------
const formatCount = (n) =>
  new Intl.NumberFormat("en", { notation: "compact" }).format(n);

// ---------------- Main Screen ----------------
export default function ProfileScreen({ route, navigation }) {
  const C = useThemeColors();
  const dispatch = useDispatch();

  const { user: currentUser } = useSelector((s) => s.auth);
  const {
    data,
    loading,
    error,
    tabs,
    activeTab,
    followersModalOpen,
    followingModalOpen,
    postModal,
  } = useSelector((s) => s.profile);

  const username = route?.params?.username || currentUser?.username;

  // ------------- Fetch profile -------------
  useEffect(() => {
    if (!username) return;
    dispatch(fetchProfile(username))
      .unwrap()
      .then((profileData) => {
        dispatch(
          fetchTabData({
            tab: activeTab,
            cursor: 0,
            username: profileData.username,
          })
        );
      })
      .catch((err) => console.log("Profile fetch error:", err));
  }, [username]);

  // ------------- Refresh / Tab fetch -------------
  useEffect(() => {
    if (!tabs[activeTab].items.length && username && data) {
      dispatch(
        fetchTabData({ tab: activeTab, cursor: 0, username: data.username })
      );
    }
  }, [activeTab, username, data]);

  const onRefresh = useCallback(() => {
    if (!username) return;
    dispatch(refreshTabStart(activeTab));
    dispatch(fetchTabData({ tab: activeTab, cursor: 0, username }));
  }, [activeTab, username]);

  const onEndReached = useCallback(() => {
    const t = tabs[activeTab];
    if (!username || t.loading || !t.hasMore) return;
    dispatch(fetchTabData({ tab: activeTab, cursor: t.cursor, username }));
  }, [tabs, activeTab, username]);

  const openLink = () => data?.link && Linking.openURL(data.link);

  // ---------------- Loading / Error ----------------
  if (loading && !data) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: C.bg.primary }]}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: C.bg.primary }]}>
        <Text style={{ color: C.text.primary, marginBottom: 8 }}>{error}</Text>
        <PrimaryButton
          title="Retry"
          onPress={() => dispatch(fetchProfile(username))}
        />
      </SafeAreaView>
    );
  }

  if (!data) return null;

  const isMe = data.isMe;
  const rel = data.relationship;
  const followLabel = rel.following
    ? "Following"
    : rel.requested
    ? "Requested"
    : data.isPrivate
    ? "Request"
    : "Follow";

  // ---------------- Render ----------------
  return (
    <SafeAreaView style={[styles.root, { backgroundColor: C.bg.primary }]}>
      <StatusBar barStyle={C.isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View
        style={[
          styles.rowBetween,
          { paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10 },
        ]}
      >
        <View style={styles.row}>
          <Text
            style={{
              color: C.text.primary,
              fontWeight: "800",
              fontSize: 25,
            }}
          >
            {data.username}
          </Text>
          {data.isVerified && (
            <Text style={{ color: "#3897f0", marginLeft: 6 }}>✓</Text>
          )}
        </View>
        <View style={styles.row}>
          {/* <Pressable
            onPress={() => Alert.alert("Options", "More options coming soon...")}
          >
            <Text style={{ color: C.text.primary, fontSize: 25 }}>⋯</Text>
          </Pressable> */}
          <Pressable
  onPress={() => navigation.navigate("ProfileSettings")}
  style={{ padding: 6 }}
>
  <Text style={{ color: C.text.primary, fontSize: 28 }}>☰</Text> {/* menu icon */}
</Pressable>

        </View>
      </View>

      {/* Profile Row */}
      <View style={[styles.row, { paddingHorizontal: 16, alignItems: "center" }]}>
        <Avatar uri={data.avatar} />
        <View
          style={[styles.rowBetween, { flex: 1, marginLeft: 22 }]}
        >
          <Stat
            label="Posts"
            value={data.stats.posts}
          />
          <Stat
            label="Followers"
            value={data.stats.followers}
            onPress={() => navigation.navigate("FollowersModal")}
          />
          <Stat
            label="Following"
            value={data.stats.following}
            onPress={() => navigation.navigate("FollowersModal")}
          />
        </View>
      </View>

      {/* Name, Bio, Link */}
      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        <Text style={{ color: C.text.primary, fontWeight: "700" }}>
          {data.fullName}
        </Text>
        {data.bio && (
          <Text style={{ color: C.text.primary, marginTop: 4 }}>{data.bio}</Text>
        )}
        {data.link && (
          <Pressable onPress={openLink}>
            <Text
              style={{ color: C.tint, marginTop: 6 }}
              numberOfLines={1}
            >
              {data.link}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Action Row */}
      <View style={[styles.row, { paddingHorizontal: 16, marginTop: 12 }]}>
        {isMe ? (
          <>
            <PrimaryButton
              title="Edit Profile"
              onPress={() => navigation.navigate("EditProfile")}
            />
            <PrimaryButton title="Share Profile" onPress={() => {}} />
          </>
        ) : (
          <>
            <PrimaryButton
              title={followLabel}
              onPress={() => dispatch(followOrUnfollow(username))}
            />
            <PrimaryButton
              title="Message"
              onPress={() => Alert.alert("Message", "Open DM thread")}
            />
            <OutlineButton title="Share" onPress={() => {}} />
          </>
        )}
      </View>

      {/* Highlights */}
      <View style={{ paddingVertical: 12 }}>
        <FlatList
          horizontal
          data={(data.highlights || []).concat(
            isMe ? [{ id: "add", title: "New", cover: null }] : []
          )}
          keyExtractor={(x) => x.id}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          renderItem={({ item }) => (
            <View style={{ alignItems: "center", marginRight: 14 }}>
              <View
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: 33,
                  borderWidth: 1,
                  borderColor: C.border,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {item.id === "add" ? (
                  <Pressable
                    onPress={() =>
                      Alert.alert("New Highlight", "Open highlight creator")
                    }
                    style={{
                      width: "100%",
                      height: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: C.tint, fontSize: 24 }}>＋</Text>
                  </Pressable>
                ) : (
                  <ImageShim uri={item.cover} />
                )}
              </View>
              <Text
                style={{
                  color: C.text.primary,
                  marginTop: 6,
                  fontSize: 12,
                }}
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Tabs */}
      <View
        style={{
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: C.border,
        }}
      />
      <View style={[styles.rowBetween]}>
        {["posts", "reels", "tagged"].map((t) => (
          <TabButton
            key={t}
            label={t.toUpperCase()}
            active={activeTab === t}
            onPress={() => dispatch(setActiveTab(t))}
          />
        ))}
      </View>

      {/* Content */}
      {data.isPrivate && !data.isMe && !data.relationship.following ? (
        <View style={{ alignItems: "center", padding: 48 }}>
          <Text
            style={{ color: C.text.primary, fontWeight: "700", fontSize: 18 }}
          >
            This account is private
          </Text>
          <Text
            style={{
              color: C.text.secondary,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Follow this account to see their photos and videos.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tabs[activeTab].items}
          keyExtractor={(x) => x.id}
          numColumns={3}
          renderItem={({ item }) => (
            <GridItem item={item} onPress={(it) => dispatch(openPost(it))} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={tabs[activeTab].refreshing}
              onRefresh={onRefresh}
            />
          }
          onEndReachedThreshold={0.3}
          onEndReached={onEndReached}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", padding: 32 }}>
              <Text style={{ color: C.text.secondary }}>
                No {activeTab} yet
              </Text>
            </View>
          )}
          ListFooterComponent={() =>
            tabs[activeTab].loading ? (
              <View style={{ padding: 16 }}>
                <ActivityIndicator />
              </View>
            ) : null
          }
        />
      )}

      {/* Modals */}
      <FollowersModal
        visible={followersModalOpen}
        onClose={() => dispatch(closeFollowers())}
        title="Followers"
      />
      <FollowersModal
        visible={followingModalOpen}
        onClose={() => dispatch(closeFollowing())}
        title="Following"
      />
      <PostModal
        visible={postModal.open}
        item={postModal.item}
        onClose={() => dispatch(closePost())}
        headerUser={data}
      />
    </SafeAreaView>
  );
}

// ---------------- Components ----------------
function ImageShim({ uri }) {
  return <Avatar uri={uri} size={66} />;
}

function TabButton({ label, active, onPress }) {
  const scheme = useColorScheme?.() || "light";
  const isDark = scheme === "dark";
  const color = active ? (isDark ? "#fff" : "#111") : isDark ? "#c7c7c7" : "#666";
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: active ? 1.75 : 0,
        borderBottomColor: color,
      }}
    >
      <Text style={{ color, fontWeight: active ? "700" : "500" }}>{label}</Text>
    </Pressable>
  );
}

function Stat({ label, value, onPress }) {
  const scheme = useColorScheme?.() || "light";
  const isDark = scheme === "dark";
  const primary = isDark ? "#fff" : "#111";
  const secondary = isDark ? "#c7c7c7" : "#666";
  return (
    <Pressable onPress={onPress} style={{ alignItems: "center" }}>
      <Text style={{ fontWeight: "700", color: primary, fontSize: 18 }}>
        {formatCount(value)}
      </Text>
      <Text style={{ color: secondary, fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
